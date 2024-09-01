import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { TUserRole } from "../modules/user/user.interface";
import catchAsync from "../utils/catchAsync";
import AppError from "../error/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { User } from "../modules/user/user.model";

// Middleware function to validate authentication and authorization
const authValidation = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Extract the token from the Authorization header
    const token = req.headers.authorization;


    // Check if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    let decoded;

    try {
      // Verify the token
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;
    } catch (err) {
      // Token is invalid or expired
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const { role, userId, } = decoded;
   

    // Check if the user exists
    const user = await User.isUserExistsByCustomId(userId);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
    }

    // Check if the user is deleted
    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "This user is deleted!");
    }

    // Check if the user is blocked
    if (user.status === "blocked") {
      throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
    }

    // Check if the user has the required role
    if (requiredRoles.length && !requiredRoles.includes(role as TUserRole)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    // Attach the user information to the request object
    req.user = decoded as JwtPayload & { role: TUserRole };

    // Proceed to the next middleware or route handler
    next();
  });
};

export default authValidation;
