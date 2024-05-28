import mongoose from 'mongoose';
import validator from "validator";


const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true,"Username Is Required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email Is Required!"],
      unique: true,
      validate: [validator.isEmail, "Provide A Valid Email!"]

    },
    password: {
      type: String,
      required: [true, "Password Is Required!"],
      minLength: [6, "Password Must Contain At Least 8 Characters!"]

    },
    profilePicture: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;