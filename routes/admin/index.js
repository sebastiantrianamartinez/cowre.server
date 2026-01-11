const express = require('express');
const adminMiddleware = require('../../middlewares/auth/admin');

const CowsRoutes = require('./cows');
const ReproductionRoutes = require('./reproduction');

function adminInitRoutes(app) {
    const router = express.Router();
    app.use('/aws', router);

    //router.use(adminMiddleware);
    router.use('/cows', CowsRoutes);    
    router.use('/reproduction', ReproductionRoutes);
}

module.exports = adminInitRoutes;