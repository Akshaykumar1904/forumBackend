import mongoose from 'mongoose';

// #region UserSchema

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    aboutMe: {
      type: String,
      // required: true,
      trim: true,
    },
    avatar: {
      type: String,
      // required: true,
      trim: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true
    }
  }, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;