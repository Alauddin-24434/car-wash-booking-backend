import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import config from '../config';
import { User } from '../modules/user/user.model'; // Adjust the path as necessary

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Get token from headers
  const token = req.headers.authorization?.replace('Bearer ', ''); // Remove 'Bearer ' from token

  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: 'Authorization token is required',
    });
  }

  try {
    // Verify JWT token
    const decoded: any = jwt.verify(token, config.jwtSecret as string);

    // Check if user exists and is admin
    const user = await User.findById(decoded.sub);

    if (!user || user.role !== 'admin') {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        statusCode: httpStatus.FORBIDDEN,
        message: 'Access denied. Admin role required.',
      });
    }

  
    next();
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: 'Invalid token',
    });
  }
};

export default authMiddleware;
