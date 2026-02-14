const express = require('express');

const aspirationsRouter = require('./aspirations');
const clivagesRouter = require('./clivages');
const transfersRouter = require('./transfers');

const router = express.Router();

router.use('/aspirations', aspirationsRouter);
router.use('/clivages', clivagesRouter);
router.use('/transfers', transfersRouter);

module.exports = router;