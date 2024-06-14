import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";
import bcrypt from 'bcrypt';
import config from "../../config";

const userSchema = new Schema<TUser>({
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
    enum: ['user', 'admin'],
    required: [true, "Role is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  },
  toObject: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
    );
  }
  next();
});

// The post middleware is not needed if you are transforming the response using toJSON and toObject
// userSchema.post('save', async function (doc, next) {
//   doc.password = '';
//   next();
// });

export const User = model<TUser>('User', userSchema);
