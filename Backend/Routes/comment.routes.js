import express from 'express';
import authenticate from '../middlewares/authenticate.middleware.js';
import { createComment, getAllComment, getCommentById } from '../controllers/comment.controller.js';
import { createLimiter, createCommentValidation, paginationValidation, getCommentValidation,asyncHandler } from '../middlewares/validation.middleware.js';


const router = express.Router();
// router.use(authenticate);


router.post('/createComment', authenticate, createLimiter, createCommentValidation, asyncHandler(createComment));
router.post('/allComment', paginationValidation, asyncHandler(getAllComment));
router.post('/getComment/:id', getCommentValidation, asyncHandler(getCommentById));


export default router;