const { Me } = require("../controllers/user.controller");
const { protect } = require("../middlewares/auth.middleware");
const express = require("express");
const router = express.Router();

router.get("/me", protect, Me);

module.exports = router;
