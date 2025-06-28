const express = require('express');
const { authenticateToken, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
router.get('/', optionalAuth, (req, res) => {
  res.json({ message: 'Get all jobs - Coming soon' });
});

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
router.get('/:id', optionalAuth, (req, res) => {
  res.json({ message: 'Get single job - Coming soon' });
});

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Employers only)
router.post('/', authenticateToken, authorize('employer'), (req, res) => {
  res.json({ message: 'Create job - Coming soon' });
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Job owner only)
router.put('/:id', authenticateToken, authorize('employer'), (req, res) => {
  res.json({ message: 'Update job - Coming soon' });
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Job owner only)
router.delete('/:id', authenticateToken, authorize('employer'), (req, res) => {
  res.json({ message: 'Delete job - Coming soon' });
});

// @desc    Search jobs
// @route   GET /api/jobs/search
// @access  Public
router.get('/search', optionalAuth, (req, res) => {
  res.json({ message: 'Search jobs - Coming soon' });
});

module.exports = router;