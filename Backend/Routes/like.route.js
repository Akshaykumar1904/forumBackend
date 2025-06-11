import express from 'express';
import authenticate from '../middlewares/authenticate.middleware.js';
import { getAllVotes, toggleVote, getVoteDetails, userHistory } from '../controllers/like.controller.js';


const router = express.Router();
router.use(authenticate);

router.post('/:id', toggleVote);
router.get('/:id/allVotes', getAllVotes);
router.get('/:id/vote-Details', getVoteDetails);
router.get('/my-votes', userHistory);

export default router;



