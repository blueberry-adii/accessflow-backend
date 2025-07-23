const { SignUp } = require("../controllers/auth.controller");
const express = require("express");
const router = express.Router();

// router("/login", LogIn);
router.post("/signup", SignUp);

module.exports = router;
