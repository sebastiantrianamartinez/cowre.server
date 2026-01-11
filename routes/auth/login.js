const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const TokenService = require('../../core/security/tokenize');
const UserHandler = require('./../../services/handlers/users');
const HashingService = require('../../core/security/hashing');

const users = new UserHandler();
const hashing = new HashingService();
const tokenizer = new TokenService();

router.post('/', async (req, res, next) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Nombre de usuario requerido' });
        }

        const user = await users.findByUsername(username);
        
        if (!user) {
            return res.status(404).json({ error: 'Usuario no registrado' });
        }

        if(!user.password || user.password == null) {
            return res.status(401).json({ error: 'Usuario sin contraseña asignada' });
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const maskedId = await hashing.idMasking(user.id, 5, 3);
        const payload = {
            id: maskedId,
            group: user.group,
            name: user.name,
        };

        const token = await tokenizer.createToken(payload, '48h');

        return res.status(200).json({
            token,
            user: payload
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
