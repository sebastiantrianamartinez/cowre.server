const express = require('express');

const FarmHandler = require('./../../../services/handlers/farms');

const router = express.Router();

const handler = new FarmHandler();

router.get('/', async (req, res) => {
    try {
        const farms = await handler.findAll();
        res.status(200).json(farms);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve farms.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const farmId = req.params.id;
        const farm = await handler.findById(farmId);
        res.status(200).json(farm);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve farm.' });
    }
});

router.post('/search', async (req, res) => {
    try {
        const { query } = req.body;
        const farms = await handler.search(query);
        res.status(200).json(farms);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to search farms.' });
    }
});

router.post('/search/owner/:ownerId', async (req, res) => {
    try {
        const ownerId = req.params.ownerId;
        const { query } = req.body;
        const farms = await handler.searchByOwner(ownerId, query);
        res.status(200).json(farms);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to search farms by owner.' });
    }
});

module.exports = router;
