const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/user.models");

exports.Me = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) throw new ApiError(400, "No user token found");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        name: user.name,
        username: user.username,
        role: user.role,
      },
      "Successfully fetched user data"
    )
  );
});
