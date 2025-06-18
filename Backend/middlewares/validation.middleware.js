import express from 'express';
import { body, param, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';


const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: 'Too many requests,please try later!!'
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: "Too many authentication requests/attempts,try again later!"
  }
})


const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "validation failed!",
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }))
    });
  }
  next();
}


const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: "Validation failed!",
      errors
    });
  }

  // mongoose duplicate error!
  if (err.name === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already Exists!`
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: "Invalid Token!"
    });
  }

  // tokenExpired
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: "Token expired!"
    });
  }

  // default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error!"
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// mongo objectId validation
const validateObjectId = (field) => {
  return param(field)
    .isMongoId()
    .withMessage(`Invalid ${field} format!`);
}

//comment routes validation 
const createCommentValidation = [
  body('content')
    .notEmpty()
    .withMessage('Content is required!')
    .isLength({ min: 1, max: 1000 })
    .withMessage('content must be between 1 and 1000 characters')
    .trim(),
  body('postId')
    .optional()
    .isMongoId()
    .withMessage('Invalid postid format!'),
  body('parentId')
    .optional()
    .isMongoId()
    .withMessage('Invalid parent comment id format!'),
  handleValidationErrors
]

const getCommentValidation = [
  validateObjectId('id'),
  body('voteType')
    .isIn(['up', 'down'])
    .withMessage('Vote type must be either up or down!'),
  handleValidationErrors
]

const toggleVotesValidation = [
  validateObjectId('id'),
  body('voteType')
    .isIn(['up', 'down'])
    .withMessage('Vote type must be either up or down'),
  handleValidationErrors
]

const getVotesValidation = [
  validateObjectId('id'),
  handleValidationErrors
]

//route post validation
const createPostValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required!')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title length must be between 3 and 200 ')
    .trim(),
  body('content')
    .notEmpty()
    .withMessage('content is required!')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Content must be between 10 and 5000 characters')
    .trim(),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array!')
    .custom((tags) => {
      if (tags.length > 10) {
        throw new Error('Maximum 10 tags allowed')
      }
      return true;
    }),
  body('tags.*')
    .optional()
    .isLength({ max: 30 })
    .withMessage('Each tag must not exceed 30 characters')
    .trim(),
  handleValidationErrors
]

const updatePostValidation = [
  validateObjectId('id'),
  body('title')
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title length must be between 3 and 200 ')
    .trim(),
  body('content')
    .optional()
    .isLength({ min: 10, max: 5000 })
    .withMessage('content must be between 10 and 5000 characters!')
    .trim(),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags.length > 10) {
        throw new Error('Maximum 10 tags allowed');
      }
      return true;
    }),
  body('tags.*')
    .optional()
    .isLength({ max: 30 })
    .withMessage('Each tag must not exceed 30 characters')
    .trim(),
  handleValidationErrors
];

const getPostValidation = [
  validateObjectId('id'),
  handleValidationErrors
];

const deletePostValidation = [
  validateObjectId('id'),
  handleValidationErrors
];

// Authentication user router validation
const registerValidation = [
  body('username')
    .notEmpty()
    .withMessage('username is required')
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .bail()
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens')
    .trim(),
  body('email')
    .notEmpty()
    .withMessage('email is required!')
    .bail()
    .isEmail()
    .withMessage('please provide valid email!')
    .bail()
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email must not exceed 100 characters'),
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('password must be between 8 and 128 characters')
    .bail()
    // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/)
    // .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
    // .bail()
  ,body('role')
    .isIn(['user', 'admin'])
    .withMessage('role must be either user or admin'),
  /*
    body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
    */
  handleValidationErrors
]

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required!'),
  handleValidationErrors
]

// pagination and query validation
const paginationValidation = [
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer!')
    .toInt(),
  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100!')
    .toInt(),
  body('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'title', 'votes'])
    .withMessage('Invalid sort field'),
  body('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  handleValidationErrors

]


export {
  paginationValidation,
  loginValidation,
  registerValidation,
  deletePostValidation,
  getCommentValidation,
  toggleVotesValidation,
  getPostValidation,
  getVotesValidation,
  updatePostValidation,
  createCommentValidation,
  createLimiter,
  createPostValidation,
  errorHandler,
  authLimiter,
  asyncHandler
}





