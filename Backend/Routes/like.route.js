import express from 'express';
import authenticate from '../middlewares/authenticate.middleware.js';
import { getAllVotes, toggleVote, getVoteDetails, userHistory } from '../controllers/like.controller.js';
import { getVotesValidation, toggleVotesValidation,asyncHandler } from '../middlewares/validation.middleware.js';


const router = express.Router();
router.use(authenticate);
/*
router.post('/:id', toggleVotesValidation, asyncHandler(toggleVote));
router.get('/:id/allVotes', getVotesValidation, asyncHandler(getAllVotes));
router.get('/:id/vote-Details', getVotesValidation, asyncHandler(getVoteDetails));
router.get('/my-votes', asyncHandler(userHistory));
*/

router.post('/:id/vote', toggleVotesValidation, asyncHandler(toggleVote));
router.get('/:id/votes', getVotesValidation, asyncHandler(getAllVotes));
router.get('/:id/vote-details', getVotesValidation, asyncHandler(getVoteDetails));
router.get('/my-votes', authenticate, asyncHandler(userHistory));

export default router;



