const express = require('express');

const aspirationsRouter = require('./aspirations');
const clivagesRouter = require('./clivages');

const router = express.Router();

router.use('/aspirations', aspirationsRouter);
router.use('/clivages', clivagesRouter);

module.exports = router;