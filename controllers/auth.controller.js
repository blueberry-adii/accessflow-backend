const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const User = require("../models/user.models");
const bcrypt = require("bcrypt");
const sendTokens = require("../utils/sendTokens");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");

exports.LogIn = asyncHandler(async (req, res, next) => {
  let { username, password } = req.body;

  username = username?.trim();
  password = password?.trim();

  if (!username || !password)
    throw new ApiError(400, "All Fields are required");

  const user = await User.findOne({ username }).select("+password");

  if (!user) throw new ApiError(400, "Invalid Credentials");

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) throw new ApiError(400, "Invalid Credentials");

  sendTokens(user, res, "Login Successful");

  // return res.status(200).json(
  //   new ApiResponse(
  //     200,
  //     {
  //       _id: user._id,
  //       name: user.name,
  //       username: user.username,
  //       role: user.role,
  //     },
  //     "Login Successful 2nd msggg"
  //   )
  // );
});

exports.SignUp = asyncHandler(async (req, res, next) => {
  let { name, username, password, confirmPassword } = req.body;

  name = name?.trim();
  username = username?.trim();
  password = password?.trim();
  confirmPassword = confirmPassword?.trim();

  const nameRegex = /^[A-Za-z ]+$/;
  const isNameValid = nameRegex.test(name);
  const isUsernameValid = /^\S+$/.test(username);
  const existingUser = await User.findOne({ username });

  if (!name || !username || !password || !confirmPassword)
    throw new ApiError(400, "All Fields are required");
  if (!isUsernameValid)
    throw new ApiError(400, "Invalid Username: must not contain whitespaces");
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

  sendTokens(user, res, "SignedUp Successfully");

  return res.status(201).json(
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

exports.LogOut = asyncHandler(async (req, res, next) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json(new ApiResponse(200, {}, "Logged Out Successfully"));
});

exports.refreshAccessToken = asyncHandler(async (req, res, next) => {
  let refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) throw new ApiError(401, "No refresh token");

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) throw new ApiError(401, "User not found");

    const accessToken = generateAccessToken(user._id);
    refreshToken = generateRefreshToken(user._id);

    req.user = user;

    return res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 20 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json(new ApiResponse(200, {}, "Access token refreshed"));
  } catch (err) {
    throw new ApiError(401, err);
  }
});

exports.checkAuth = asyncHandler(async (req, res, next) => {
  res.status(200).json(new ApiResponse(200, {}, "Access Token Found"));
});
