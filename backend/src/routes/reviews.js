const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
router.post('/', authenticateToken, (req, res) => {
  res.json({ message: 'Create review - Coming soon' });
});

// @desc    Get reviews for user
// @route   GET /api/reviews/user/:userId
// @access  Public
router.get('/user/:userId', (req, res) => {
  res.json({ message: 'Get user reviews - Coming soon' });
});

// @desc    Get reviews for job
// @route   GET /api/reviews/job/:jobId
// @access  Public
router.get('/job/:jobId', (req, res) => {
  res.json({ message: 'Get job reviews - Coming soon' });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private (Review owner only)
router.put('/:id', authenticateToken, (req, res) => {
  res.json({ message: 'Update review - Coming soon' });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Review owner only)
router.delete('/:id', authenticateToken, (req, res) => {
  res.json({ message: 'Delete review - Coming soon' });
});

module.exports = router;