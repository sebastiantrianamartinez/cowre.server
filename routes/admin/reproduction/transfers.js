const express = require('express');
const TransferHandler = require('./../../../services/handlers/transfers');

const router = express.Router();
const handler = new TransferHandler();

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

module.exports = router;