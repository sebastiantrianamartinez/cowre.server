const express = require('express');
const FarmHandler = require('../../../services/handlers/farms');

const router = express.Router();
const handler = new FarmHandler();

router.post('/search', async (req, res, next) => {
    try {
        const { query } = req.body;
        const results = await handler.search(query);
        res.json(results);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const data = req.body;
        const newFarm = await handler.create(data);
        res.status(201).json(newFarm);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const farm = await handler.getById(id);
        if (!farm) {
            return res.status(404).json({ message: 'Farm not found' });
        }
        res.json(farm);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updatedFarm = await handler.update(id, data);
        if (!updatedFarm) {
            return res.status(404).json({ message: 'Farm not found' });
        }
        res.json(updatedFarm);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await handler.delete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Farm not found' });
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

module.exports = router;