import mongoose from 'mongoose';
import User from './user.model.js';
import Posts from './post.model.js';

// #region commentSchema

const commentSchema = new mongoose.Schema(
  {
   content:{
    type:String,
    required:true,
    trim:true
   },
   author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
   },
   post:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Post',
    required:true
   },
   parentComment:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Comment',
    default:null,
   }
  },{timestamps:true});

const Comment = mongoose.model('Comments',commentSchema);
export default Comment;
