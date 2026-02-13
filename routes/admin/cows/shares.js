const express = require("express");
const router = express.Router();

const ShareHandler = require("../../../services/handlers/shares");
const ShareManager = require("../../../services/managers/shares");

const handler = new ShareHandler();
const manager = new ShareManager();

router.post("/", async (req, res) => {
    try {
        const payload = req.body;

        if (!payload || !payload.cow || !payload.owner || !payload.percent) {
            return res.status(400).json({
                error: "Invalid payload structure.",
            });
        }

        const share = await handler.create(payload);

        return res.status(201).json(share);
    } catch (error) {
        console.error("[SHARE CREATE ERROR]", error);

        return res.status(500).json({
            error: error.message || "Error creating share.",
        });
    }
});

router.post('/sync', async (req, res) => {
    try {
        const payload = req.body;

        const result = await manager.sync(payload);

        return res.status(200).json(result);
    } catch (error) {
        console.error('[SHARE SYNC ERROR]', error);

        return res.status(500).json({
            error: error.message || 'Error syncing shares.',
        });
    }
});

router.post("/bulk", async (req, res) => {
    try {
        const payload = req.body;

        if (
            !payload ||
            !Array.isArray(payload.shares) ||
            payload.shares.length === 0
        ) {
            return res.status(400).json({
                error: "Invalid payload structure.",
            });
        }

        const shares = await handler.bulkCreate(payload.shares);

        return res.status(201).json(shares);
    } catch (error) {
        console.error("[SHARE BULK CREATE ERROR]", error);

        return res.status(500).json({
            error: error.message || "Error creating shares.",
        });
    }
});

module.exports = router;