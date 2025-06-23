
import { model, Schema, } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import bcrypt from "bcryptjs";
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
      default:"user",
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
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
  }
);

userSchema.pre("save", async function (next) {
  const isUserEmailExist = await User.findOne({ email: this.email });
  if (isUserEmailExist) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "This email is already exist!"
    );
  }
  next();
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
    );
  }
  next();
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email });
};
userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findById(id);
};
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>("User", userSchema);

