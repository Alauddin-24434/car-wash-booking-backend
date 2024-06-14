import { NextFunction, Request, Response } from "express";


const dynamicError=(errorResult:any)=>{
    return async (req:Request, res:Response,next:NextFunction)=>{
        return res.status(401).json({
            success: false,
            statusCode: 401,
            message: "Invalid email or password"
          });
        }
}


export default dynamicError;


