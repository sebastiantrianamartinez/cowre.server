const express = require('express');

const TransferHandler = require('./../../../services/handlers/transfers');
const TransferManager = require('./../../../services/managers/transfers');

const router = express.Router();
const handler = new TransferHandler();
const manager = new TransferManager();

router.post('/session/init', async (req, res) => {
    const { staff, farm, date, client, opu } = req.body;
    
    try{
        const session = await handler.createSession(staff, farm, new Date(date || Date.now()), { client, opu });
        return res.json(session);
    }
    catch(err) {        
        console.error('Error initializing session:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/sync', async (req, res) => {
    const payload = req.body;

    try {
        await manager.sync(payload);
        return res.json({ success: true });
    }   
    catch (err) {
        console.error('Error syncing transfers:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }   
});

module.exports = router;