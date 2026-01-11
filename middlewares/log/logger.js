const extractBeforeChangesOnly = (details) => {
    const before = details?.before || {};
    const after = details?.after || {};
    const changes = {};

    for (const key of Object.keys(after)) {
        if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
            changes[key] = before[key] ?? null;
        }
    }

    return Object.keys(changes).length > 0 ? changes : null;
};

module.exports = function activityLogger(table, targetFrom = 'auto', targetKey = 'id') {
    return async function (req, res, next) {
        const LogHandler = require('../../services/handlers/logs');
        const handler = new LogHandler(table);

        const ACTION_BY_METHOD = {
            POST: 2,
            PUT: 1,
            PATCH: 1,
            DELETE: 5
        };

        const action = ACTION_BY_METHOD[req.method];
        const oldJson = res.json.bind(res);

        res.json = async function (data) {
            try {
                const userId = req.user?.id || req.body?.user || null;
                const detailsPayload = data?.details || null;

                let target = null;

                if (targetFrom === 'auto') {
                    target =
                        req.params?.[targetKey] ||
                        data?.data?.[targetKey] ||
                        data?.[targetKey] ||
                        req.body?.[targetKey] ||
                        null;
                }

                if (targetFrom === 'params') target = req.params?.[targetKey];
                if (targetFrom === 'response') target = data?.[targetKey] || data?.data?.[targetKey];
                if (targetFrom === 'body') target = req.body?.[targetKey];

                let details = null;

                if (detailsPayload) {
                    const beforeOnly = extractBeforeChangesOnly(detailsPayload);

                    if (beforeOnly) {
                        details = {
                            before: beforeOnly,
                            note: detailsPayload?.details || null
                        };
                    } else if (detailsPayload?.details) {
                        details = { note: detailsPayload.details };
                    }
                }

                if (userId && target && action) {
                    await handler.create({
                        action,
                        target,
                        user: userId,
                        details,
                        table
                    });
                }
            } catch (err) {
                console.error(err);
            }

            return oldJson(data);
        };

        next();
    };
};
