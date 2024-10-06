/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, Schema } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser {
  [x: string]: any;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "admin" | "user";
  address: string;
  image?: string;
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
    //instance methods for checking if the user exist
    isUserExistsByCustomId(id: string): Promise<TUser>;
  //instance methods for checking if the user exist
  isUserExistsByEmail(email: string): Promise<TUser>;
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;



export type TUpdateUser={

  name:string;
  phone:string;
  address:string;
 
 }
