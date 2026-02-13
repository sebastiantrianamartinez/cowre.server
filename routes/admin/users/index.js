const express = require('express');

const FarmsRoutes = require('./farms');
const LabsRoutes = require('./labs');

const UserHandler = require('./../../../services/handlers/users');
const FarmHandler = require('./../../../services/handlers/farms');

const router = express.Router();
const handler = new UserHandler();
const farmHandler = new FarmHandler();

router.use('/farms', FarmsRoutes);
router.use('/labs', LabsRoutes);

router.post('/', async (req, res) => {
    try {
        const payload = req.body;
        console.log('Creating user with payload:', payload);

        const farms = payload.farms || [];

        
        delete payload.farms;

        const newUser = await handler.create(payload);
        res.status(201).json({
            data: newUser,
            details: req.body?.details || null
        });

        if(farms && Array.isArray(farms)) {
            for(const farm of farms) {
                if(farm.size == ''){
                    delete farm.size;
                }
                farm.owner = newUser.id;
                const newFarm = await farmHandler.create(farm); 
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create user.' });
    }
});

router.post('/search', async (req, res) => {
    try {
        const { query, filter } = req.body;
        const results = await handler.search(query, filter);
        res.status(200).json(results);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to search users.' });
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

router.get('/farms/owner/:ownerId', async (req, res) => {
    try {
        const ownerId = req.params.ownerId;
        const farms = await farmHandler.findByOwner(ownerId);
        res.status(200).json(farms);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve farms by owner.' });
    }
});

module.exports = router;