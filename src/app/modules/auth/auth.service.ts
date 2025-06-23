import httpStatus from "http-status";

import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import AppError from "../../error/AppError";

import jwt from "jsonwebtoken";
import { TUser } from "../user/user.interface";
import config from "../../config";




const createUserIntoDB = async (payload: TUser) => {
  const newUser = await User.create(payload);
  return newUser;
};







const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");

  return user;


};


const handleRefreshToken = async (refreshToken: string) => {
  const decoded = jwt.verify(refreshToken, config.jwt_refresh_secret) as { id: string };

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const newAccessToken = jwt.sign(
    { id: user._id, role: user.role },
    config.jwt_access_secret,
    { expiresIn: "1h" }
  );

  return newAccessToken;
};














export const AuthServices = {
  loginUser,
  handleRefreshToken,
  createUserIntoDB
};
