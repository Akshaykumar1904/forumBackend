import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const generateWebToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {expiresIn:'5d'}
  );
}

// #region reg.Controller

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "These are required - username,email,password,role!"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
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
        id:newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        password: newUser.password,
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}

//#endregion

//#region loginController

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email,passwords are required!"
      });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "user doesn't exist or invalid email!"
      });
    }

    const matchPasswords = await bcrypt.compare(password, existingUser.password);
    if(!matchPasswords){
      return res.status(400).json({
        success:false,
        message:"Invalid credentials!"
      });
    }

    const token = generateWebToken(existingUser._id);
    return res.status(201).json({
      success:true,
      message:"User logged in successfully!",
      token,
      user:{
        _id:existingUser._id,
        username:existingUser.username,
        email:existingUser.email,
        role:existingUser.role,
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "intermal server error",
      error: error.message
    });
  }
}

//#endregion






export {
  register,
  login
};
