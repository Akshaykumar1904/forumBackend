import express from 'express';
import authentication from '../middlewares/authenticate.middleware.js'
import { createPost, deletePost, updatePost, getAllPosts, getSpecificPost } from '../controllers/post.controller.js';

import { createLimiter, getPostValidation, createPostValidation, updatePostValidation, deletePostValidation, paginationValidation,asyncHandler } from '../middlewares/validation.middleware.js';

const router = express.Router();
router.use(authentication);

/*
router.post('/createPost', createLimiter, createPostValidation, asyncHandler(createPost));
router.post('/posts', paginationValidation, asyncHandler(getAllPosts));
router.post('/posts/:id', getPostValidation, asyncHandler(getSpecificPost));
router.put('/:id', updatePostValidation, asyncHandler(updatePost));
router.delete('/:id', deletePostValidation, asyncHandler(deletePost));
*/

router.post('/', createLimiter, createPostValidation, asyncHandler(createPost));
router.get('/', paginationValidation, asyncHandler(getAllPosts));
router.get('/:id', getPostValidation, asyncHandler(getSpecificPost));
router.put('/:id', updatePostValidation, asyncHandler(updatePost));
router.delete('/:id', deletePostValidation, asyncHandler(deletePost));


export default router;