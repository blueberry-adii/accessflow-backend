const {
  SignUp,
  LogIn,
  LogOut,
  refreshAccessToken,
  checkAuth,
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
const express = require("express");
const router = express.Router();

router.get("/check-auth", protect, checkAuth);
router.get("/refresh-token", refreshAccessToken);
router.post("/signup", SignUp);
router.post("/login", LogIn);
router.post("/logout", LogOut);

module.exports = router;
