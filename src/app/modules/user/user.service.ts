import { TUser } from "./user.interface";
import { User } from "./user.model";

const createUserIntoDB = async (payload: TUser) => {
  const newUser = await User.create(payload);
  return newUser;
};






const getUserById= async (id: string) => {
  // Find the user by email
  const user = await User.findById(id)
  return user;
}








export const userServices = { createUserIntoDB, getUserById };
