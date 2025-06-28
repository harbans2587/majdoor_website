const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  createReview,
  getUserReviews,
  getJobReviews,
  updateReview,
  deleteReview,
  flagReview,
  voteOnReview
} = require('../controllers/reviewController');

const router = express.Router();

// Validation rules for review creation
const createReviewValidation = [
  body('revieweeId')
    .isMongoId()
    .withMessage('Valid reviewee ID is required'),
  body('jobId')
    .isMongoId()
    .withMessage('Valid job ID is required'),
  body('applicationId')
    .isMongoId()
    .withMessage('Valid application ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comment must be less than 1000 characters'),
  body('categories.punctuality')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Punctuality rating must be between 1 and 5'),
  body('categories.quality')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Quality rating must be between 1 and 5'),
  body('categories.communication')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Communication rating must be between 1 and 5'),
  body('categories.professionalism')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Professionalism rating must be between 1 and 5'),
  body('categories.value')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Value rating must be between 1 and 5')
];

// Validation rules for flag
const flagReviewValidation = [
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Reason is required for flagging')
];

// Validation rules for vote
const voteValidation = [
  body('helpful')
    .isBoolean()
    .withMessage('Helpful must be true or false')
];

// Routes
router.post('/', authenticateToken, createReviewValidation, createReview);
router.get('/user/:userId', getUserReviews);
router.get('/job/:jobId', getJobReviews);
router.put('/:id', authenticateToken, createReviewValidation, updateReview);
router.delete('/:id', authenticateToken, deleteReview);
router.post('/:id/flag', authenticateToken, flagReviewValidation, flagReview);
router.post('/:id/vote', authenticateToken, voteValidation, voteOnReview);

module.exports = router;