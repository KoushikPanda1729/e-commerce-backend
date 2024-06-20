import asyncHandler from "./../utils/asyncHandler.util.js";
import ApiError from "./../utils/apiError.util.js";
import User from "../models/user.model.js";
import uploadOnCloudinary, {
  deleteOnCloudinary,
} from "../utils/cloudinary.util.js";
import ApiRespose from "../utils/apiResponse.util.js";
import sendMail from "../utils/sendMail.util.js";
import { generateRandom6DigitNumber } from "../utils/otpGenerate.util.js";
import { expireTimeFunction } from "../utils/timeExpire.util.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      400,
      "Error occured while generate access token and refresh token :: ",
      error
    );
  }
};

const userRegister = asyncHandler(async (req, res, _) => {
  const { userName, email, password, fullName, role, answer, address } =
    req.body;

  if (
    [userName, email, password, fullName, role, answer, address].some(
      (field) => field.trim().length === 0
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (!(role === "user" || role === "admin")) {
    throw new ApiError(400, "Please define the correct role");
  }
  if (!req.file?.path) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatarLocalPath = req.file?.path;

  const avatarCloudinaryURL = await uploadOnCloudinary(avatarLocalPath);

  const existsUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existsUser) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({
    userName: userName.toLowerCase(),
    email,
    password,
    fullName,
    address,
    role,
    avatar: {
      public_id: avatarCloudinaryURL.public_id,
      url: avatarCloudinaryURL.url,
    },
    answer,
  });

  if (!user) {
    throw new ApiError(400, "Somthing went wrong while creating user");
  }

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -answer"
  );

  return res
    .status(200)
    .json(new ApiRespose(200, createdUser, "User registerd successfully"));
});

const userLogin = asyncHandler(async (req, res, _) => {
  const { userName, email, password } = req.body;

  if (!(userName || email)) {
    throw new ApiError(400, "Username or Email is required");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid credintials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user?._id);

  const loggedInUser = await User.findById(user?.id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiRespose(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const userLoggOut = asyncHandler(async (req, res, _) => {
  const userId = req?.user?._id;
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $unset: { refreshToken: null },
      // $unset: { refreshToken: "" },
    },
    {
      new: true,
    }
  );

  if (!user) {
    throw new ApiError(400, "Unauthorized request");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiRespose(200, {}, "User logged out successfully"));
});

const updateProfile = asyncHandler(async (req, res, _) => {
  const { newPassword, oldPassword } = req.body;

  const userId = req?.user?._id;

  const user = await User.findById(userId);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Old password is not correct");
  }

  user.password = newPassword;
  user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiRespose(200, {}, "Password update successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res, _) => {
  const incommingRefreshToken =
    req?.cookies?.refreshToken || req.body?.refreshToken;

  if (!incommingRefreshToken) {
    throw new ApiError(200, "Unauthorized request");
  }

  const user = await User.findOne({ refreshToken: incommingRefreshToken });

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user?._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiRespose(200, { accessToken, refreshToken }, "access token refresh")
    );
});

const updateAvatar = asyncHandler(async (req, res, _) => {
  if (!req.file?.path) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatarLocalPath = req.file?.path;

  const avatarCloudinaryURL = await uploadOnCloudinary(avatarLocalPath);

  // console.log("old :: ", req.user?.avatar?.url);
  // console.log("new :: ", avatarCloudinaryURL?.url);

  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: {
      avatar: {
        public_id: avatarCloudinaryURL.public_id,
        url: avatarCloudinaryURL.url,
      },
    },
  });

  await deleteOnCloudinary(req.user?.avatar?.public_id);

  return res
    .status(200)
    .json(new ApiRespose(200, {}, "Avatar updated successfully"));
});

const getUser = asyncHandler(async (req, res, _) => {
  const user = await User.find({}).select("-password -answer -refreshToken");

  return res
    .status(200)
    .json(new ApiRespose(200, user, "Get All detail of user"));
});

const forgotPassword = asyncHandler(async (req, res, _) => {
  const { email, answer, newPassword } = req.body;

  console.log(req.body);
  if ([email, answer, newPassword].some((field) => field.trim().length === 0)) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({
    $or: [{ email }, { answer }],
  });

  const isPasswordValid = await user.isPasswordCorrect(newPassword);
  if (isPasswordValid) {
    throw new ApiError(400, "new password is never same as old password");
  }

  const isAnswerCorrect = await user.isAnswerCorrect(answer);
  if (!isAnswerCorrect) {
    throw new ApiError(400, "Wrong answer");
  }

  if (!user) {
    throw new ApiError(400, "User does not exists");
  }

  const updatePasswordUser = await User.findById(user?._id).select(
    "-password -answer"
  );
  updatePasswordUser.password = newPassword;
  updatePasswordUser.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiRespose(200, updatePasswordUser, "Password updated successfully")
    );
});

const sendOTP = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    user.otp = generateRandom6DigitNumber();
    user.expireAt = Date.now() + 3 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const sendingEmail = user?.email;
    const sendignOTP = user?.otp;
    await sendMail(sendingEmail, "password-change", sendignOTP);

    return res
      .status(200)
      .json(new ApiRespose(200, {}, "Email send successfully"));
  } catch (error) {
    console.log("error is >>> ::: ", error.message || error);
    return res
      .status(400)
      .json(new ApiError(400, error.message || "some error occured"));
  }
});

const forgotPasswordUsingOTP = asyncHandler(async (req, res) => {
  const { otp, newPassword } = req.body;
  if (!otp) {
    throw new ApiError(400, "OTP is required");
  }

  const user = await User.findOne({ otp });
  const isPasswordValid = await user.isPasswordCorrect(newPassword);
  if (isPasswordValid) {
    throw new ApiError(400, "new password is never same as old password");
  }
  const isOTPNotValid = expireTimeFunction(user.expireAt);

  if (isOTPNotValid) {
    user.otp = undefined;
    user.expireAt = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(400, "OTP is not valid");
  }

  if (!user) {
    throw new ApiError(400, "OTP not matched");
  }
  user.password = newPassword;
  user.otp = undefined;
  user.expireAt = undefined;
  await user.save({ validateBeforeSave: false });
  console.log(user);
  return res
    .status(200)
    .json(new ApiRespose(200, {}, "Password updated successfully"));
});

export {
  userRegister,
  userLogin,
  userLoggOut,
  updateProfile,
  refreshAccessToken,
  updateAvatar,
  getUser,
  forgotPassword,
  sendOTP,
  forgotPasswordUsingOTP,
};
