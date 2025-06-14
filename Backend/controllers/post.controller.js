import Post from '../models/post.model.js';

//#region createPost

const createPost = async (req, res) => {
  try {
    console.log("system is hanged!");
    const { title, content, author, tags } = req.body;
    console.log(title, content, author, tags);
    if (!title || !content || !author || !tags) {
      return res.status(400).json({
        success: false,
        message: "Title,content and author required!",
        error: error.message,
      });
    }
    console.log("its here also");
    const userId = req.user._id;
    console.log(userId);
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid user!",
        error: error.message,

      });
    }
    const post = new Post({
      title,
      content,
      tags,
      author: userId,
    });
    console.log(post);
    console.log("fine here but ", post)
    await post.save();
    console.log("fine here")
    return res.status(200).json({
      success: true,
      message: "New post is created!",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
}

//#endregion
// #region updatePost

const updatePost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    if (!postId || !userId) {
      return res.status(400).json({
        success: false,
        message: "PostId and userId are required in order to update the post!",
      });
    }
    console.log(userId);
    console.log(postId);
    if (!title || !content || !tags) {
      return res.status(400).json({
        success: false,
        message: "Title,content and tags required!",
        error: error.message,
      });
    }
    const currentPost = await Post.findById(postId);
    console.log(currentPost);
    if (!currentPost) {
      return res.status(400).json({
        success: false,
        message: "Invalid post or you do not have permission to update!"
      });
    }
    if (currentPost.author.toString() !== userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized Person!",
        error: error.message
      });
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
    console.log(updatePost);
    return res.status(201).json({
      success: true,
      message: "Post is now updated!",
      updatePost
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

//#endregion
//#region deletePost

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    if (!postId || !userId) {
      return res.status(400).json({
        success: false,
        message: "PostId & userId is required",
        error: error.message,
      });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post is required or you do not have permission to delete!F",
        error: error.message,
      });
    }
    if (post.author.toString() !== userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized user!",
        error: error.message,
      });
    }
    await Post.findByIdAndDelete(postId);
    res.status(200).json({
      success: true,
      message: "post is now deleted successfully!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
//#endregion
//#region getAllPosts
const getAllPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is requred,Authorization error",
        error: error.message,
      });
    }
    console.log(userId);
    const userPosts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .select('-__v');

    console.log(userPosts);
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
//#endregion
// #region getPost

const getSpecificPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post is not found",
        error: error.message,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Post retreived Successfully!",
      post
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

//#endregion

export {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getSpecificPost
}