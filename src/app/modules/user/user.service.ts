import { TUser } from "./user.interface";
import { User } from "./user.model";

const createUserIntoDB = async (payload: TUser) => {
  const newUser = await User.create(payload);
  return newUser;
};

const loginUserIntoDB = async (email: string) => {
  // Find the user by email
  const user = await User.findOne({ email });
  return user;
};

export const userServices = { createUserIntoDB, loginUserIntoDB };
