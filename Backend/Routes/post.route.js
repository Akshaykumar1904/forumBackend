import express from 'express';
import authenticate from '../middlewares/authenticate.middleware.js'
import { createPost, deletePost, updatePost, getAllPosts, getSpecificPost } from '../controllers/post.controller.js';

import { createLimiter, getPostValidation, createPostValidation, updatePostValidation, deletePostValidation, paginationValidation } from '../middlewares/validation.middleware.js';
/*
import { asyncHandler } from '../middlewares/validation.middleware.js';
*/
import { catchAsync } from '../middlewares/error.middleware.js';
const router = express.Router();
router.use(authenticate);

/*
router.post('/createPost', createLimiter, createPostValidation, asyncHandler(createPost));
router.post('/posts', paginationValidation, asyncHandler(getAllPosts));
router.post('/posts/:id', getPostValidation, asyncHandler(getSpecificPost));
router.put('/:id', updatePostValidation, asyncHandler(updatePost));
router.delete('/:id', deletePostValidation, asyncHandler(deletePost));
*/

router.post('/', createLimiter, createPostValidation, catchAsync(createPost));
router.get('/', paginationValidation, catchAsync(getAllPosts));
router.get('/:id', getPostValidation, catchAsync(getSpecificPost));
router.put('/:id', updatePostValidation, catchAsync(updatePost));
router.delete('/:id', deletePostValidation, catchAsync(deletePost));


export default router;