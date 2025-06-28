const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, authorize } = require('../middleware/auth');
const {
  getUserProfile,
  updateProfile,
  getMyJobs,
  getMyApplications,
  getDashboardStats,
  uploadProfilePicture,
  searchUsers,
  updateAvailability
} = require('../controllers/userController');

const router = express.Router();

// Validation rules for profile update
const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL')
];

// Public routes
router.get('/search', searchUsers);
router.get('/:id', getUserProfile);

// Private routes
router.get('/dashboard/stats', authenticateToken, getDashboardStats);
router.put('/profile', authenticateToken, updateProfileValidation, updateProfile);
router.post('/profile-picture', authenticateToken, uploadProfilePicture);

// Role-specific routes
router.get('/my/jobs', authenticateToken, authorize('employer'), getMyJobs);
router.get('/my/applications', authenticateToken, authorize('worker'), getMyApplications);
router.put('/availability', authenticateToken, authorize('worker'), updateAvailability);

module.exports = router;