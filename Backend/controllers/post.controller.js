import Post from '../models/post.model.js';
import { AuthorizationError, ValidationError } from '../utils/customError.js';

//#region createPost

const createPost = async (req, res) => {
  // console.log("system is hanged!");
  const { title, content, author, tags } = req.body;
  // console.log(title, content, author, tags);
  if (!title || !content || !author || !tags) {
    throw new AuthorizationError('Title,content and author required!');
  }
  // console.log("its here also");
  const userId = req.user._id;
  // console.log(userId);
  if (!userId) {
    throw new AuthorizationError('Invalid user!');
  }
  const post = new Post({
    title,
    content,
    tags,
    author: userId,
  });
  console.log(post);
  // console.log("fine here but ", post)
  await post.save();
  // console.log("fine here")
  return res.status(200).json({
    success: true,
    message: "New post is created!",
    post,
  });

}

//#endregion
// #region updatePost

const updatePost = async (req, res) => {
  const { title, content, tags } = req.body;
  const postId = req.params.id;
  const userId = req.user._id;
  if (!postId || !userId) {
    throw new ValidationError('PostId and userId are required in order to update the post!');
  }
  // console.log(userId);
  // console.log(postId);
  if (!title || !content || !tags) {
    throw new ValidationError('Title,content and tags required!');
  }
  const currentPost = await Post.findById(postId);
  // console.log(currentPost);
  if (!currentPost) {
    throw new ValidationError('Invalid post or you do not have permission to update!');
  }
  if (currentPost.author.toString() !== userId.toString()) {
    throw new AuthorizationError('Unauthorized Person!');
  }
  const updatePost = await Post.findByIdAndUpdate(
    postId,
    {
      title: title || currentPost.title,
      content: content || currentPost.content,
      tags: tags || currentPost.tags,
      // updatedAt: new Date()
    },
    { new: true, runValidators: true }
  );
  // console.log(updatePost);
  return res.status(201).json({
    success: true,
    message: "Post is now updated!",
    updatePost
  });

}

//#endregion
//#region deletePost

const deletePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;
  if (!postId || !userId) {
    throw new AuthorizationError('PostId & userId is required');
  }
  const post = await Post.findById(postId);
  if (!post) {
    throw new ValidationError('Post is required or you do not have permission to delete!');
  }
  if (post.author.toString() !== userId.toString()) {
    throw new AuthorizationError('Unauthorized user!');
  }
  await Post.findByIdAndDelete(postId);
  res.status(200).json({
    success: true,
    message: "post is now deleted successfully!"
  });

}
//#endregion
//#region getAllPosts
const getAllPosts = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new AuthorizationError('UserId is requred');
  }
  // console.log(userId);
  const userPosts = await Post.find({ author: userId })
    .sort({ createdAt: -1 })
    .select('-__v');

  // console.log(userPosts);
  res.status(200).json({
    success: true,
    count: userPosts.length,
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email
    },
    data: userPosts
  });

}
//#endregion
// #region getPost

const getSpecificPost = async (req, res) => {
  const postId = req.params.id;

  const post = await Post.findById(postId);
  if (!post) {
    throw new AuthorizationError('Post is not found');
  }
  return res.status(200).json({
    success: true,
    message: "Post retreived Successfully!",
    post
  });

}

//#endregion

export {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getSpecificPost
}