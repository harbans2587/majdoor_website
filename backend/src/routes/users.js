const express = require('express');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
router.get('/:id', (req, res) => {
  res.json({ message: 'Get user profile - Coming soon' });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Update user profile - Coming soon' });
});

// @desc    Get user's jobs (for employers)
// @route   GET /api/users/my-jobs
// @access  Private
router.get('/my-jobs', authenticateToken, authorize('employer'), (req, res) => {
  res.json({ message: 'Get user jobs - Coming soon' });
});

// @desc    Get user's applications (for workers)
// @route   GET /api/users/my-applications
// @access  Private
router.get('/my-applications', authenticateToken, authorize('worker'), (req, res) => {
  res.json({ message: 'Get user applications - Coming soon' });
});

module.exports = router;