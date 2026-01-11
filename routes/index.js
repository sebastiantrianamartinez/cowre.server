const express = require('express');

const adminInitRoutes = require('./admin');
const authInitRoutes = require('./auth');

function initRoutes(app) {
    const router = express.Router();
    app.use('/api', router);

    router.use('/ping', (req, res) => {
        res.status(200).json({ pong: 'pong ' + new Date() });
    });

    authInitRoutes(router);
    adminInitRoutes(router);
}

module.exports = initRoutes;
