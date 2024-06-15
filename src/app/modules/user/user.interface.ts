import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";


export interface TUser {
  [x: string]: any;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'admin' | 'user';
  address: string;
};



export interface UserModel extends Model<TUser> {
  //instance methods for checking if the user exist
  isUserExistsByEmail(email: string): Promise<TUser>;
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
 
}

export type TUserRole = keyof typeof USER_ROLE;