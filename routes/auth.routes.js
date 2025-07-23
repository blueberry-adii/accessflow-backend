const { LogIn, SignUp } = require("../controllers/auth.controllers");
const express = require("express");
const router = express.Router();

router("/login", LogIn);
router("signup", SignUp);

module.exports = router;
