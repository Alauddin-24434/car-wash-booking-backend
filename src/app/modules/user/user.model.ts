/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: [true, "Role is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  },
);

userSchema.pre("save", async function (next) {
  const isUserEmailExist = await User.findOne({ email: this.email });
  if (isUserEmailExist) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "This email is already exist!",
    );
  }
  next();
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds),
    );
  }
  next();
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email });
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>("User", userSchema);
