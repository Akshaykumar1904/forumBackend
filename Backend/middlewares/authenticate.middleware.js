import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if(!authHeader){
      return res.status(400).json({
        success:false,
        message:"Valid Token required!"
      });
    }

    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
       return res.status(400).json({
        success:false,
        message:"Valid Token required!"
      });
    }


    let decodedToken;
    try {
      decodedToken = jwt.verify(token,process.env.JWT_SECRET);
    } catch (error) {
      return res.status(500).json({
        success:false,
        message:"In verifying jwt token!"
      });
    }

    const user = await User.findById(decodedToken.userId)
    .select('-password');
    if(!user){
       return res.status(400).json({
        success:false,
        message:"Token valid but user no longer exists!!"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export default authenticate;