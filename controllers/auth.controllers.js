const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const User = require("../models/user.models");
const bcrypt = require("bcrypt");

exports.LogIn = asyncHandler(async (req, res, next) => {});

exports.SignUp = asyncHandler(async (req, res, next) => {
  let { name, username, password, confirmPassword } = req.body;

  name = name?.trim();
  username = username?.trim();
  password = password?.trim();
  confirmPassword = confirmPassword?.trim();

  const nameRegex = /^[A-Za-z ]+$/;
  const isNameValid = nameRegex.test(name);
  const existingUser = await User.findOne({ username });

  if (!name || !username || !password || !confirmPassword)
    throw new ApiError(400, "All Fields are required");
  if (!isNameValid)
    throw new ApiError(400, "Invalid Name: name must contain only alphabets");
  if (name.length < 2 || name.length > 12)
    throw new ApiError(400, "Name must be between 2-12 chars");
  if (username.length < 5 || username.length > 15)
    throw new ApiError(400, "Username must be between 5-15 chars");
  if (existingUser) throw new ApiError(409, "Username already taken");
  if (password.length < 8)
    throw new ApiError(400, "Password must be atleast 8 chars");
  if (password != confirmPassword)
    throw new ApiError(400, "Password doesn't match");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    username,
    password: hashedPassword,
    role: "user",
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {
          _id: user._id,
          name: user.name,
          username: user.username,
          role: user.role,
        },
        "SignedUp successfully"
      )
    );
});
