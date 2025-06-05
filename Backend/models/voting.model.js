import mongoose from 'mongoose';
import User from './user.model.js';
import Post from './post.model.js';

const votingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    /*
    upVote: {
      type: Number,
      default:0,
    },
    downVote: {
      type: Number,
      default:0,
    }
      */
    voteType:{
      type:String,
      enum:["up","down"],
      required:true,
     }
  }, { timestamps: true });

const Vote = mongoose.model('Vote', votingSchema);
export default Vote;
