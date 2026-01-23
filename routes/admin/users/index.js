const express = require('express');

const UserHandler = require('./../../../services/handlers/users');

const router = express.Router();
const handler = new UserHandler();

router.post('/', async (req, res) => {
    try {
        const payload = req.body;
        console.log('Creating user with payload:', payload);

        const newUser = await handler.create(payload);
        res.status(201).json({
            data: newUser,
            details: req.body?.details || null
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create user.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await handler.findAll();
        res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve users.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await handler.findById(userId);
        res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve user.' });
    }
});

router.get('/role/:role', async (req, res) => {
    try {
        const role = req.params.role;
        const users = await handler.findByRole(role);
        res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve users by role.' });
    }
});

module.exports = router;