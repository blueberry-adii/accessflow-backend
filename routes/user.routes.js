const {
  Me,
  AllUsers,
  makeAdmin,
  removeAdmin,
  kick,
} = require("../controllers/user.controller");
const { protect, roleBasedAccess } = require("../middlewares/auth.middleware");
const express = require("express");
const router = express.Router();

router.get("/me", protect, Me);
router.get(
  "/admin/all-users",
  protect,
  roleBasedAccess("admin", "owner"),
  AllUsers
);
router.post(
  "/admin/make-admin",
  protect,
  roleBasedAccess("admin", "owner"),
  makeAdmin
);
router.post(
  "/admin/remove-admin",
  protect,
  roleBasedAccess("admin", "owner"),
  removeAdmin
);
router.delete("/admin/kick", protect, roleBasedAccess("admin", "owner"), kick);

module.exports = router;
