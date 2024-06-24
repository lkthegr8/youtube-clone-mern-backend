import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const gernerateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  const { fullName, userName, email, password } = req.body;

  // validation
  //   if (fullName === "") {
  //     throw new ApiError(400, "Full name is required");
  //   }
  if (
    [fullName, userName, email, password].some((feild) => {
      return feild?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All feilds are required");
  }

  // check if user already exists: username, email
  const existedUser = await User.findOne({ $or: [{ userName }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User already exists with this email or username");
  }
  // check for images, check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  // upload them to cloudinary, avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  let coverImage;
  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }
  if (
    req.files &&
    Array.isArray(req.files?.coverImage) &&
    req.files?.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
  }
  // create user object -create entry in db
  const user = await User.create({
    fullName,
    userName: userName.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });
  // remove password from user object and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" //here we mention what we want to remove
  );
  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  // return response: sending response in a formatted way
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User Registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  const { email, userName, password } = req.body;
  // check for user name and email
  if (!email && !userName) {
    throw new ApiError(400, "Email or username is required");
  }
  // find the user
  const user = await User.findOne({ $or: [{ email }, { userName }] });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  // check for password
  const isPasswordCorrect = await user.isPasswordCorrect(password); // we have added this function to schema in user.model.js
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invali user credentials");
  }
  // access and refresh token
  const { accessToken, refreshToken } = await gernerateAccessAndRefreshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // send tokens via cookies
  const options = {
    httpOnly: true,
    secure: true,
  }; // to make non modifiable by user in front end

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true, // this will return updated user
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  }; // to make non modifiable by user in front end

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});
export { registerUser, loginUser, logoutUser };
