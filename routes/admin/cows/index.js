const express = require("express");
const router = express.Router();

const CowsRoutes = require("./cows");
const FarmsRoutes = require("./farms");
const SharesRoutes = require("./shares");

router.use("/farms", FarmsRoutes);
router.use("/shares", SharesRoutes);
router.use("/", CowsRoutes);

module.exports = router;