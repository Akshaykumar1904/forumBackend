import express from 'express';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
const router = express.Router();

// #region registerUser

router.post('/register', async (req, res) => {
  const { username, email, password, aboutMe, avatar, role } = req.body;
})




export default router;