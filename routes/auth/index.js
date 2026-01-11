const express = require('express');

const LoginRoute = require('./login');
const router = express.Router();

function authInitRoutes(app) {
    app.use('/auth', router);

    router.use('/login', LoginRoute);
}

module.exports = authInitRoutes;