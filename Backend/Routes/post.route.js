import express from 'express';
import authentication from '../middlewares/authenticate.middleware.js'
import { createPost, deletePost, updatePost,getAllPosts,getSpecificPost } from '../controllers/post.controller.js';

const router = express.Router();
router.use(authentication);

router.post('/createPost',createPost);
router.post('/posts',getAllPosts);
router.post('/posts/:id',getSpecificPost);
router.put('/:id',updatePost);
router.delete('/:id',deletePost);



export default router;