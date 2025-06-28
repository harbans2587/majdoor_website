const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, authorize, optionalAuth } = require('../middleware/auth');
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobsByEmployer,
  searchJobs
} = require('../controllers/jobController');

const router = express.Router();

// Validation rules for job creation
const createJobValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Description must be between 50 and 2000 characters'),
  body('category')
    .isIn([
      'construction', 'cleaning', 'delivery', 'cooking', 'gardening',
      'plumbing', 'electrical', 'painting', 'carpentry', 'moving',
      'security', 'babysitting', 'elderly_care', 'tutoring', 'data_entry',
      'photography', 'event_planning', 'maintenance', 'other'
    ])
    .withMessage('Please select a valid category'),
  body('location.address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('location.address.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('location.coordinates.lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Valid latitude is required'),
  body('location.coordinates.lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Valid longitude is required'),
  body('budget.amount')
    .isFloat({ min: 1 })
    .withMessage('Budget amount must be greater than 0'),
  body('budget.type')
    .isIn(['hourly', 'daily', 'weekly', 'monthly', 'fixed'])
    .withMessage('Please select a valid budget type'),
  body('duration')
    .isIn(['one_time', 'temporary', 'permanent', 'contract'])
    .withMessage('Please select a valid duration'),
  body('startDate')
    .isISO8601()
    .toDate()
    .withMessage('Valid start date is required')
];

// Routes
router.get('/', optionalAuth, getJobs);
router.get('/search', optionalAuth, searchJobs);
router.get('/employer/:employerId', getJobsByEmployer);
router.get('/:id', optionalAuth, getJobById);
router.post('/', authenticateToken, authorize('employer'), createJobValidation, createJob);
router.put('/:id', authenticateToken, authorize('employer'), updateJob);
router.delete('/:id', authenticateToken, authorize('employer'), deleteJob);

module.exports = router;