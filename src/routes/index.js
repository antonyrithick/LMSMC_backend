const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoute");
const trainerRoutes = require("./trainerRoute");
const messageRoutes=require('./messageRoute')
const adminRoutes=require('./adminRoutes')
const courseRoutes=require('./coursesRoutes')

router.use("/", authRoutes);
router.use("/courses", courseRoutes);
router.use("/", trainerRoutes);
router.use("/chat",messageRoutes)
router.use("/admin",adminRoutes)
module.exports = router;
