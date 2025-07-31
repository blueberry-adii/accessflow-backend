const ApiResponse = require("./ApiResponse");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("./generateTokens");

const sendTokens = (user, res, message = "Login Success") => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 20 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          _id: user._id,
          name: user.name,
          username: user.username,
          role: user.role,
        },
        message
      )
    );
};

module.exports = sendTokens;
