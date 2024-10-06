import { TUpdateUser, TUser } from "./user.interface";
import {  User } from "./user.model";

const createUserIntoDB = async (payload: TUser) => {
  const newUser = await User.create(payload);
  console.log(newUser)
  return newUser;
};






const getUserById= async (id: string) => {
  // Find the user by email
  const user = await User.findById(id)
  return user;
}

const getAllUsersIntoDB= async () => {

  const user = await User.find()
  return user;
}






const updateUserRoleInDB = async (userId: string, role: string) => {
  console.log(userId)
  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true } // Return the updated document
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const updateUserDataThroughUser = async (userId: string, userInfo: Partial<TUser>) => {
  try {
    // Fetch the user from the database, including the password
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Retain the existing password
    const existingPassword = user.password;

    // Merge the provided `userInfo` with the existing password
    const updatedUserData = {
      ...userInfo,          // Update fields from the client (name, email, address, phone, etc.)
      password: existingPassword, // Keep the existing password intact
    };
    console.log("update", updatedUserData)

    // Perform the update
    const result = await User.updateOne({ _id: userId }, updatedUserData);
console.log("result", result)
    // Check if the update was successful
    if (result.modifiedCount > 0) {
      return result;
    } else {
      throw new Error('No changes made to the user data');
    }
  } catch (error: any) {
    console.error('Error updating user:', error);
    throw new Error(error.message || 'An error occurred while updating the user');
  }
};








export const userServices = {
  createUserIntoDB,
  getUserById,
  updateUserDataThroughUser,
  getAllUsersIntoDB,
  updateUserRoleInDB, // Export the new service function
};