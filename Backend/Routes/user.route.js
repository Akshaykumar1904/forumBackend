import express from 'express';
import { login, register } from '../controllers/user.controller.js';
import { loginValidation, registerValidation,asyncHandler } from '../middlewares/validation.middleware.js';
const router = express.Router();

// #region registerUser
router.post('/register', registerValidation, asyncHandler(register));
router.post('/login', loginValidation, asyncHandler(login));

export default router;