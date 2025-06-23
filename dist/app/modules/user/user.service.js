"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const user_model_1 = require("./user.model");
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the user by email
    const user = yield user_model_1.User.findById(id);
    return user;
});
const getAllUsersIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.find();
    return user;
});
const updateUserRoleInDB = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(userId);
    const user = yield user_model_1.User.findByIdAndUpdate(userId, { role }, { new: true } // Return the updated document
    );
    if (!user) {
        throw new Error("User not found");
    }
    return user;
});
const updateUserDataThroughUser = (userId, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the user from the database, including the password
        const user = yield user_model_1.User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Retain the existing password
        const existingPassword = user.password;
        // Merge the provided `userInfo` with the existing password
        const updatedUserData = Object.assign(Object.assign({}, userInfo), { password: existingPassword });
        console.log("update", updatedUserData);
        // Perform the update
        const result = yield user_model_1.User.updateOne({ _id: userId }, updatedUserData);
        console.log("result", result);
        // Check if the update was successful
        if (result.modifiedCount > 0) {
            return result;
        }
        else {
            throw new Error('No changes made to the user data');
        }
    }
    catch (error) {
        console.error('Error updating user:', error);
        throw new Error(error.message || 'An error occurred while updating the user');
    }
});
exports.userServices = {
    getUserById,
    updateUserDataThroughUser,
    getAllUsersIntoDB,
    updateUserRoleInDB, // Export the new service function
};
