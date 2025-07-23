const { SignUp, LogIn } = require("../controllers/auth.controller");
const express = require("express");
const router = express.Router();

router.post("/signup", SignUp);
router.post("/login", LogIn);

module.exports = router;
