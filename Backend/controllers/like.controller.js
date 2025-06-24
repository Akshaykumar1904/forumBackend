import Vote from "../models/voting.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { AuthorizationError, ValidationError } from "../utils/customError.js";

// #region toggleVote

const toggleVote = async (req, res) => {
  const postId = req.params.id;
  const { voteType } = req.body;
  const userId = req.user._id;
  // console.log(postId, voteType, userId);
  if (!postId || !userId) {
    throw new AuthorizationError('PostId ,UserId is required!')
  }

  // console.log("something here fine!")

  if (!voteType || !['up', 'down'].includes(voteType)) {
    throw new ValidationError('voteType is required!')
  }

  // console.log("vote okay!");
  const post = await Post.findById(postId);
  if (!post) {
    throw new ValidationError('Post is missing,or youre not authorize for this action!')
  }
  // console.log("post okay!");

  const exisitingVote = await Vote.findOne({ user: userId, post: postId });
  if (exisitingVote) {
    if (exisitingVote.voteType === voteType) {
      await Vote.deleteOne({ _id: exisitingVote._id });
      await updatePostVoteCount(postId);
      return res.status(200).json({
        success: true,
        message: `${voteType === 'up' ? 'Upvote' : 'Downvote'} removed`,
        action: 'removed',
        voteType: null,
        hasVoted: false
      });
    } else {
      exisitingVote.voteType = voteType;
      await exisitingVote.save();
      await updatePostVoteCount(postId);
      return res.status(200).json({
        success: true,
        message: `Vote changed to ${voteType === 'up' ? 'upvote' : 'downvote'}`,
        action: 'updated',
        voteType: voteType,
        hasVoted: true
      });
    }
  } else {
    const newVote = await Vote.create({
      user: userId,
      post: postId,
      voteType: voteType
    });

    await updatePostVoteCount(postId);

    return res.status(201).json({
      success: true,
      message: `${voteType === 'up' ? 'Upvoted' : 'Downvoted'} successfully`,
      action: 'created',
      voteType: voteType,
      hasVoted: true,
      voteId: newVote._id
    });
  }
}


//#region allVotes
const getAllVotes = async (req, res) => {

  const postId = req.params.id;
  const userId = req.user._id;
  // console.log(postId, userId);
  if (!postId || !userId) {
    throw new AuthorizationError('PostId and userId required!!')
  }

  // console.log("before post")
  const post = await Post.findById({ _id: postId });
  // console.log(post);
  if (!post) {
    throw new ValidationError('Invalid post Id!');
  }

  const upVotesCount = await Vote.countDocuments({ post: postId, voteType: "up" });
  const downVotesCount = await Vote.countDocuments({ post: postId, voteType: "down" });

  // console.log(upVotesCount, downVotesCount);
  const userVote = await User.findOne({ user: userId, post: postId });

  res.status(200).json({
    success: true,
    upVotes: upVotesCount,
    downVotes: downVotesCount,
    totalVotes: upVotesCount + downVotesCount,
    votesCount: post.votesCount,
    userVote: userVote ? userVote.voteType : null,
    hasVoted: !!userVote
  });
}



// #region getVoteDetails
const getVoteDetails = async (req, res) => {
  const postId = req.params.id;
  const { voteType } = req.body;
  if (!voteType || !postId) {
    throw new AuthorizationError('postId and voteType required!');
  }
  const post = await Post.findById(postId);
  if (!post) {
    throw new ValidationError('Post not found!');
  }

  const query = { post: postId };
  if (voteType && ['up', 'down'].includes(voteType)) {
    query.voteType = voteType;
  }
  const votes = await Vote.find(query)
    .populate('user', 'username')
    .sort({ createdAt: -1 });

  const formattedVotes = votes.map(vote => ({
    _id: vote._id,
    voteType: vote.voteType,
    user: {
      _id: vote.user._id,
      username: vote.user.username
    }
  }));

  res.status(200).json({
    success: true,
    message: "Successfully retreived!",
    voteType: voteType || 'all',
    votes: formattedVotes,
    count: formattedVotes.length
  });
}



//#region userVotingHistory
const userHistory = async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;
  if (!userId) {
    throw new AuthorizationError('Invalid User!');
  }

  const votes = await Vote.find({ user: userId })
    .populate('post', 'title content')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const totalVotes = await Vote.countDocuments({ user: userId });
  if (!totalVotes) {
    throw new ValidationError('Invalid user!');
  }

  const formattedVotes = votes.map(vote => ({
    _id: vote._id,
    voteType: vote.voteType,
    post: {
      _id: vote.post._id,
      title: vote.post.title
    }
  }));

  res.status(200).json({
    votes: formattedVotes,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalVotes / limit),
      totalVotes,
      hasNext: page * limit < totalVotes,
      hasPrev: page > 1
    }
  });
}



async function updatePostVoteCount(postId) {
    const upVotes = await Vote.countDocuments({ post: postId, voteType: "up" });
    const downVotes = await Vote.countDocuments({ post: postId, voteType: "down" });

    await Post.findByIdAndUpdate(postId, {
      votesCount: upVotes - downVotes
    });

    // console.log(`Updated Post ${postId} has vote Count :${upVotes - downVotes}`);
}
export {
  // #region helperFunction
  toggleVote,
  getAllVotes,
  getVoteDetails,
  userHistory
}
