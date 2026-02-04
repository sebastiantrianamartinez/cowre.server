const express = require('express');
const ClivageManager = require('./../../../services/managers/clivages');
const ClivageAssembler = require('./../../../services/assemblers/clivages');

const router = express.Router();
const manager = new ClivageManager();

router.post('/opu', async (req, res) => {
    try {
        const payload = req.body;

        if (
            !payload ||
            !payload.session ||
            !payload.lab ||
            !Array.isArray(payload.clivages) ||
            payload.clivages.length === 0
        ) {
            return res.status(400).json({
                error: 'Invalid payload structure.'
            });
        }

        await manager.createFromPayload(payload);

        return res.status(201).json({
            success: true,
            message: 'Clivages and embryos created successfully.'
        });
    }
    catch (error) {
        console.error('[CLIVAGE CREATE ERROR]', error);

        return res.status(500).json({
            error: error.message || 'Error creating clivages.'
        });
    }
});

router.get('/session/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({
                error: 'Session ID is required.'
            });
        }

        const assembler = new ClivageAssembler();
        const clivages = await assembler.assembleForTransfer(sessionId);

        return res.status(200).json(clivages);
    }
    catch (error) {
        console.error('[CLIVAGE FETCH ERROR]', error);

        return res.status(500).json({
            error: error.message || 'Error fetching clivages.'
        });
    }
});

module.exports = router;
