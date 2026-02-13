const { models, sequelize } = require('../../core/database');

class ShareManager {
    constructor() {
        this.model = models.Share;
    }

    async sync(payload) {
        const transaction = await sequelize.transaction();

        try {
            const { cow, management, shares } = payload;

            if (!cow || !management || !Array.isArray(shares)) {
                throw new Error('Invalid payload structure.');
            }

            // 1️⃣ Traer SOLO shares de esa vaca y ese management
            const existing = await this.model.findAll({
                where: { cow },
                transaction
            });

            const existingFiltered = existing.filter(s =>
                s.remarks?.management === management
            );

            const existingMap = new Map(
                existingFiltered.map(s => [s.id, s])
            );

            const incomingIds = shares
                .filter(s => s.id)
                .map(s => s.id);

            // 2️⃣ Eliminar los que ya no vienen
            for (const dbShare of existingFiltered) {
                if (!incomingIds.includes(dbShare.id)) {
                    await dbShare.destroy({ transaction });
                }
            }

            // 3️⃣ Validación fuerte (muy recomendable)
            const total = shares.reduce(
                (acc, s) => acc + parseFloat(s.percent || 0),
                0
            );

            if (total !== 100) {
                throw new Error('Shares must sum to 100%.');
            }

            // 4️⃣ Crear o actualizar
            for (const share of shares) {
                const remarks = {
                    ...(share.remarks || {}),
                    management
                };

                if (share.id && existingMap.has(share.id)) {
                    await existingMap.get(share.id).update(
                        {
                            owner: share.owner,
                            percent: parseFloat(share.percent),
                            remarks
                        },
                        { transaction }
                    );
                } else {
                    await this.model.create(
                        {
                            cow,
                            owner: share.owner,
                            percent: parseFloat(share.percent),
                            remarks
                        },
                        { transaction }
                    );
                }
            }

            await transaction.commit();

            return { success: true };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = ShareManager;
