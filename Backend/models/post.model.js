import mongoose from 'mongoose';
import User from './user.model.js';
import Tag from './tag.model.js';

// #region PostSchema

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Tag',
      default: [],
    },
    votesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    }
  }, { timestamps: true });

const Post = mongoose.model('Post',postSchema);
export default Post;