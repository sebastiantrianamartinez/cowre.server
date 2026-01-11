const TokenService = require('../../core/security/tokenize');
const HashingService = require('../../core/security/hashing');
const dotenv = require('dotenv').config();

const tokenizer = new TokenService();
const hashing = new HashingService();

module.exports = async function (req, res, next) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('No token provided or invalid format');
        req.user = null;
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    if( process.env.MASTER_ACCESS && token === process.env.MASTER_ACCESS_KEY ) {
        req.user = { id: 1, group: 1 }; 
        return next();
    }   

    try {
        const decoded = tokenizer.verifyToken(token);
        req.user = decoded?.decoded || null;
        req.user.id = await hashing.idUnmasking(req.user.id, 5, 3); 
        req.user.group = 1;
        console.log(`User ID unmasked: ${req.user.id}`);
    } catch (err) {
        req.user = null;
        console.log('Invalid token:', err.message);
        return res.status(401).json({ error: 'Unauthorized' });  
    }
    next();
};