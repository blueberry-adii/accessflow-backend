const {
  Me,
  AllUsers,
  makeAdmin,
  removeAdmin,
  kick,
  NewUsers,
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
router.get("/new-users", protect, NewUsers);
router.put(
  "/admin/make-admin/:username",
  protect,
  roleBasedAccess("admin", "owner"),
  makeAdmin
);
router.put(
  "/admin/remove-admin/:username",
  protect,
  roleBasedAccess("admin", "owner"),
  removeAdmin
);
router.delete(
  "/admin/kick/:username",
  protect,
  roleBasedAccess("admin", "owner"),
  kick
);

module.exports = router;
