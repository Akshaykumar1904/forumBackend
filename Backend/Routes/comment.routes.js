import express from 'express';
import authenticate from '../middlewares/authenticate.middleware.js';
import { createComment, getAllComment, getCommentById } from '../controllers/comment.controller.js';
import { createLimiter, createCommentValidation, paginationValidation, getCommentValidation} from '../middlewares/validation.middleware.js';
/*
import { asyncHandler } from '../middlewares/validation.middleware.js';
*/
import { catchAsync } from '../middlewares/error.middleware.js';


const router = express.Router();
// router.use(authenticate);

/*
router.post('/createComment', authenticate, createLimiter, createCommentValidation, asyncHandler(createComment));
router.post('/allComment', paginationValidation, asyncHandler(getAllComment));
router.post('/getComment/:id', getCommentValidation, asyncHandler(getCommentById));
*/

router.post('/', authenticate, createLimiter, createCommentValidation, catchAsync(createComment));
router.get('/', paginationValidation, catchAsync(getAllComment));
router.get('/:id', getCommentValidation, catchAsync(getCommentById));
// router.put('/:id', authenticate, updateCommentValidation, asyncHandler(updateComment));
// router.delete('/:id', authenticate, deleteCommentValidation, asyncHandler(deleteComment));

export default router;