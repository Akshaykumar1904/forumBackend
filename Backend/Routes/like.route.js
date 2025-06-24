import express from 'express';
import authenticate from '../middlewares/authenticate.middleware.js';
import { getAllVotes, toggleVote, getVoteDetails, userHistory } from '../controllers/like.controller.js';
import { getVotesValidation, toggleVotesValidation } from '../middlewares/validation.middleware.js';
/*
import { asyncHandler } from '../middlewares/validation.middleware.js';
*/
import { catchAsync } from '../middlewares/error.middleware.js';


const router = express.Router();
router.use(authenticate);
/*
router.post('/:id', toggleVotesValidation, asyncHandler(toggleVote));
router.get('/:id/allVotes', getVotesValidation, asyncHandler(getAllVotes));
router.get('/:id/vote-Details', getVotesValidation, asyncHandler(getVoteDetails));
router.get('/my-votes', asyncHandler(userHistory));
*/

router.post('/:id/vote', toggleVotesValidation, catchAsync(toggleVote));
router.get('/:id/votes', getVotesValidation, catchAsync(getAllVotes));
router.get('/:id/vote-details', getVotesValidation, catchAsync(getVoteDetails));
router.get('/my-votes', catchAsync(userHistory));

export default router;



