const express = require("express");
const router = express.Router();

const CowsRoutes = require("./cows");
const FarmsRoutes = require("./farms");

router.use("/farms", FarmsRoutes);
router.use("/", CowsRoutes);

module.exports = router;