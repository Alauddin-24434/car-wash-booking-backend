import httpStatus from "http-status";
import jwt from 'jsonwebtoken';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";
import bcrypt from 'bcrypt';
import config from "../../config";


// Create user
const createUser = catchAsync(async (req, res) => {
  const bodyData = req.body;
  const result = await userServices.createUserIntoDB(bodyData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is created successfully",
    data: result,
  });
});



// Login user
const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: "Email and password are required",
    });
  }

  // Find the user by email
  const user = await userServices.loginUserIntoDB(email);

  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Invalid email or password",
    });
  }

  // Compare the provided password with the stored hashed password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Invalid email or password",
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      sub: user._id,
      name: user.name,
      email: user.email,

    },
    config.jwtSecret as string,
    { expiresIn: '1h' }
  );
console.log(token)
  // Remove password from user object before sending the response


  // Return response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    token,
    data: user,
  });
});

export const userControllers = {
  createUser,
  loginUser,
};
