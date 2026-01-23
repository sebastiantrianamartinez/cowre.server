const express = require('express');

const LabHandler = require('./../../../services/handlers/labs');

const router = express.Router();
const handler = new LabHandler();

router.post('/', async (req, res) => {
    try {
        const payload = req.body;
        console.log('Creating lab with payload:', payload);

        const newLab = await handler.create(payload);
        res.status(201).json(newLab);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create lab.' });
    }       
});

router.get('/', async (req, res) => {
    try {
        const labs = await handler.findAll();
        res.status(200).json(labs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve labs.' });
    }       
});

router.get('/:id', async (req, res) => {
    try {
        const labId = req.params.id;
        const lab = await handler.findById(labId);
        res.status(200).json(lab);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve lab.' });
    }       
});

module.exports = router;    