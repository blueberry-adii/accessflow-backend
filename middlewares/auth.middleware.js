const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/user.models");

exports.protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) throw new ApiError(401, "Unauthorized: No access Token");

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) throw new ApiError(401, "Unauthorized: User not found");

    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, "Unauthorized: Token invalid");
  }
});

exports.roleBasedAccess = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.user.role;

    if (!allowedRoles.includes(role))
      throw new ApiError(401, "Access denied: insufficient permissions");

    next();
  };
};
