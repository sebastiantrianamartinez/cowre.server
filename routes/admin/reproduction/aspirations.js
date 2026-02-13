const express = require('express');

const AspirationHandler = require('../../../services/handlers/aspirations');
const AspirationAssembler = require('../../../services/assemblers/aspirations');
const AspirationManager = require('../../../services/managers/aspirations');

const router = express.Router();
const handler = new AspirationHandler();
const assembler = new AspirationAssembler();
const manager = new AspirationManager();

router.post('/session/init', async (req, res) => {
    const { staff, farm, date } = req.body;
    
    try{
        console.log('Initializing aspiration session for staff:', staff, 'farm:', farm, 'date:', date);
        const session = await handler.createSession(staff, farm, new Date(date || Date.now()));
        return res.json({ session });
    }
    catch(err) {        
        console.error('Error initializing session:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/session/save', async (req, res) => {
    const { opus, session } = req.body;

    await manager.saveOrUpdate({ id: session }, opus);
    return res.json({ success: true, session });
});

router.get('/session/:session', async (req, res) => {
    const { session } = req.params;

    const opus = await assembler.assembleBySession(session);
    return res.json(opus);
});

router.get('/sessions', async (req, res) => {
    const sessions = await handler.getAllSessions();
    const opus = [];

    for (const session of sessions) {
        const assemblerInstance = new AspirationAssembler();
        const assembled = await assemblerInstance.assembleBySession(session.uuid);
        opus.push(assembled);
    }
    
    return res.json(opus);
});

module.exports = router;