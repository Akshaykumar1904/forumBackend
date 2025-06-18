import Comment from "../models/comment.model.js";
// import User from "../models/user.model.js";
import Post from "../models/post.model.js";


// #region createComment
const createComment = async (req, res) => {
  try {
    const { content, post, parentComment } = req.body;
    const author = req.user._id;
    if (!author) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
        error: error.message
      });
    }
    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content not found !",
        error: error.message
      });
    }

    const postExists = await Post.findById(post);
    if (!postExists) {
      return res.status(400).json({
        success: false,
        message: "Post not found or you do not have permission to do this !",
        error: error.message
      });
    }

    // if a reply ,check for comments
    if (parentComment) {
      const parentExists = await Comment.findById(parentComment);
      if (!parentExists) {
        return res.status(500).json({
          success: false,
          message: "Parent comment not found!",
          error: error.message
        });
      }
    }

    // create comment
    const comment = new Comment({
      content,
      author,
      post,
      parentComment: parentComment || null
    })

    await comment.save();
    await comment.populate('author', 'username email');

    await Post.findByIdAndUpdate(post, {
      $inc: { commentsCount: 1 }
    });

    return res.status(200).json({
      success: true,
      message: "Comment created Successfully!!",
      data: comment
    });

  } catch (error) {
    throw error;
    /*
    return res.status(500).jsom({
      success: false,
      message: "Internal Server error",
      error: error.message
    });
    */
  }
}

//#region getAllComment
const getAllComment = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log(page);
    console.log(limit);
    console.log(skip);
    const comments = await Comment.find()
      .populate('author', 'username email')
      .populate('post', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log(comments);

    const total = await Comment.countDocuments();
    console.log(total);
    res.status(200).json({
      success: true,
      data: comments,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    throw error;
    /*
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message
    });
    */
  }
}

// #region getSpecificComment
const getCommentById = async (req, res) => {
  try {
    const commentId = req.params.id;
    console.log(commentId);
    if (!commentId) {
      return res.status(400).json({
        success: false,
        message: "commentId is required!",
        error: error.message
      });
    }
    const comment = await Comment.findById(commentId)
      .populate('author', 'username email')
      .populate('post', 'title');

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "comment is required!",
        error: error.message
      });
    }
    res.status(200).json({
      success:true,
      message:"Comment found!",
      data:comment,
    });


  } catch (error) {
    /*
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message
    });
    */
   throw error;
  }
}

export {
  createComment,
  getAllComment,
  getCommentById
}