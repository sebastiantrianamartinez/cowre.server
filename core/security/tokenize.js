const jwt = require('jsonwebtoken');

require('dotenv').config();

class TokenService {
    constructor() {
        this.secret = process.env.JWT_SECRET;
        if (!this.secret) {
            throw new Error('JWT_SECRET is not defined in .env file');
        }
    }

    createToken(payload, expiresIn = '6h') {
        return jwt.sign(payload, this.secret, { expiresIn });
    }

    verifyToken(token) {
        try {
            return {
                success: true,
                decoded: jwt.verify(token, this.secret)
            };
        } catch (error) {
            return {
                success: false,
                error: 'Invalid token',
                details: error
            };
        }
    }

    readToken(token) {
        try {
            return jwt.decode(token);
        } catch (error) {
            throw new Error('Unable to decode token');
        }
    }

    createCustomToken(payload, expiresIn = '30m', secret) {
        return jwt.sign(payload, secret, { expiresIn });
    }

    verifyCustomToken(token, secret) {
        try {
            return {
                success: true,
                decoded: jwt.verify(token, secret)
            };
        } catch (error) {
            return {
                success: false,
                error: 'Invalid token',
                details: error
            };
        }
    }

    readCustomToken(token) {
        try {
            return jwt.decode(token);
        } catch (error) {
            throw new Error('Unable to decode token');
        }
    }
}

module.exports = TokenService;