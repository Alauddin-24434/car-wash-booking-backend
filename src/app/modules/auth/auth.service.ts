import httpStatus from "http-status";

import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import AppError from "../../error/AppError";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");

  // create a jwt token

  const jwtPayload = {
    userId: user?.id,
    role: user.role,
  };
 

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn:'10d'
  });

return {
    accessToken,
    user,
}

};

export const AuthServices = {
  loginUser,
};
