const express = require('express');
const ClivageHandler = require('../../../services/handlers/clivages');

const router = express.Router();
const handler = new ClivageHandler();

router.post('/opu', async (req, res) => {
    try {
        const { clivages } = req.body;
        if (!Array.isArray(clivages) || clivages.length === 0) {
            return res.status(400).json({ error: 'Invalid clivages data.' });
        }

        const createdClivages = [];
        for (const clivageData of clivages) {
            const newClivage = await handler.create(clivageData);
            createdClivages.push(newClivage);
        }

        res.status(201).json(createdClivages);
    }
    catch (error) {
        console.error(error);
    }
});

module.exports = router;