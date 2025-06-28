const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, authorize } = require('../middleware/auth');
const {
  applyToJob,
  getJobApplications,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
  getApplication,
  getEmployerApplicationStats
} = require('../controllers/applicationController');

const router = express.Router();

// Validation rules for job application
const applyToJobValidation = [
  body('jobId')
    .isMongoId()
    .withMessage('Valid job ID is required'),
  body('coverLetter')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Cover letter must be less than 1000 characters'),
  body('proposedRate.amount')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Proposed rate must be greater than 0'),
  body('proposedRate.type')
    .optional()
    .isIn(['hourly', 'daily', 'weekly', 'monthly', 'fixed'])
    .withMessage('Invalid rate type')
];

// Validation rules for status update
const updateStatusValidation = [
  body('status')
    .isIn(['pending', 'viewed', 'shortlisted', 'interview', 'hired', 'rejected'])
    .withMessage('Invalid status'),
  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note must be less than 500 characters')
];

// Routes
router.post('/', authenticateToken, authorize('worker'), applyToJobValidation, applyToJob);
router.get('/my-applications', authenticateToken, authorize('worker'), getMyApplications);
router.get('/stats/employer', authenticateToken, authorize('employer'), getEmployerApplicationStats);
router.get('/job/:jobId', authenticateToken, authorize('employer'), getJobApplications);
router.get('/:id', authenticateToken, getApplication);
router.put('/:id/status', authenticateToken, authorize('employer'), updateStatusValidation, updateApplicationStatus);
router.delete('/:id', authenticateToken, authorize('worker'), withdrawApplication);

module.exports = router;