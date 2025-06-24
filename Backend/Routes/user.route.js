import express from 'express';
import { login, register } from '../controllers/user.controller.js';
import { loginValidation, registerValidation } from '../middlewares/validation.middleware.js';
/*
import {asyncHandler} from '../middlewares/validation.middleware.js'
*/
import { catchAsync } from '../middlewares/error.middleware.js';
const router = express.Router();

// #region registerUser
router.post('/register', registerValidation, catchAsync(register));
router.post('/login', loginValidation, catchAsync(login));

export default router;