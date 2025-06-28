const express = require('express');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Apply to job
// @route   POST /api/applications
// @access  Private (Workers only)
router.post('/', authenticateToken, authorize('worker'), (req, res) => {
  res.json({ message: 'Apply to job - Coming soon' });
});

// @desc    Get applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Job owner only)
router.get('/job/:jobId', authenticateToken, authorize('employer'), (req, res) => {
  res.json({ message: 'Get job applications - Coming soon' });
});

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Job owner only)
router.put('/:id/status', authenticateToken, authorize('employer'), (req, res) => {
  res.json({ message: 'Update application status - Coming soon' });
});

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private (Applicant only)
router.delete('/:id', authenticateToken, authorize('worker'), (req, res) => {
  res.json({ message: 'Withdraw application - Coming soon' });
});

module.exports = router;