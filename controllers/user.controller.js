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
        joined: user.createdAt,
      },
      "Successfully fetched user data"
    )
  );
});

exports.AllUsers = asyncHandler(async (req, res, next) => {
  const allUsers = await User.find();
  const users = allUsers.map((user) => {
    return {
      name: user.name,
      username: user.username,
      role: user.role,
      joined: user.createdAt,
    };
  });

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Successfully fetched all the users"));
});

exports.makeAdmin = asyncHandler(async (req, res, next) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (!user) throw new ApiError(404, "No User Found");
  if (user.role == "owner")
    throw new ApiError(403, "Cannot change the role of Owner");
  if (user.role == "admin")
    throw new ApiError(409, `${user.name} is already an Admin`);
  user.role = "admin";
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, `Successfully promoted ${user.name} to admin`)
    );
});

exports.removeAdmin = asyncHandler(async (req, res, next) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (!user) throw new ApiError(404, "No User Found");
  if (user.role == "owner")
    throw new ApiError(403, "Cannot change the role of Owner");
  if (user.role == "user")
    throw new ApiError(409, `${user.name} is already at their lowest role`);
  user.role = "user";
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, `Successfully demoted ${user.name} to user`)
    );
});

exports.kick = asyncHandler(async (req, res, next) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (!user) throw new ApiError(404, "No User Found");
  if (user.role == "owner") throw new ApiError(403, "Cannot kick the Owner");
  await user.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, user, `Successfully kicked ${user.name}`));
});
