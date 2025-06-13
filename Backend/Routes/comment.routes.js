import express from 'express';
import authenticate from '../middlewares/authenticate.middleware.js';
import { createComment, getAllComment, getCommentById } from '../controllers/comment.controller.js';
const router = express.Router();
// router.use(authenticate);


router.post('/createComment', authenticate, createComment);
router.post('/allComment', getAllComment);
router.post('/getComment/:id', getCommentById);
export default router;