import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticationError, AuthorizationError } from "../utils/customError.js";

const generateWebToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '5d' }
  );
}

// #region reg.Controller

const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    throw new AuthorizationError(' username,email,password,role');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AuthenticationError('user already exists');
  }

  //if not then hash the password first
  const hashedPassword = await bcrypt.hash(password, 10);

  //create new user with hashed password
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    role
  });

  await newUser.save();
  const userToken = generateWebToken(newUser._id);

  return res.status(201).json({
    success: true,
    message: "User is registered succesfully!",
    userToken,
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      password: newUser.password,
    }
  });
}

//#endregion

//#region loginController

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AuthorizationError('email,passwords are required!');
  }

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new AuthorizationError("user doesn't exist or invalid email");
  }

  const matchPasswords = await bcrypt.compare(password, existingUser.password);
  if (!matchPasswords) {
    throw new AuthenticationError('Invalid credentials');
  }

  const token = generateWebToken(existingUser._id);
  return res.status(201).json({
    success: true,
    message: "User logged in successfully!",
    token,
    user: {
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      role: existingUser.role,
    }
  });
}

//#endregion






export {
  register,
  login
};
