const Application = require('../models/Application');
const Job = require('../models/Job');
const { validationResult } = require('express-validator');

// @desc    Apply to job
// @route   POST /api/applications
// @access  Private (Workers only)
const applyToJob = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { jobId, coverLetter, proposedRate, availability } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications'
      });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job'
      });
    }

    // Check if application deadline has passed
    if (job.applicationDeadline && new Date() > job.applicationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed'
      });
    }

    // Check if maximum applications reached
    if (job.applicationsCount >= job.maxApplications) {
      return res.status(400).json({
        success: false,
        message: 'This job has reached the maximum number of applications'
      });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      employer: job.employer,
      coverLetter,
      proposedRate,
      availability,
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        updatedBy: req.user._id
      }]
    });

    // Increment applications count
    await job.incrementApplications();

    // Populate application data
    await application.populate([
      {
        path: 'job',
        select: 'title category budget duration location'
      },
      {
        path: 'applicant',
        select: 'firstName lastName averageRating totalReviews skills'
      },
      {
        path: 'employer',
        select: 'firstName lastName companyName'
      }
    ]);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Job owner only)
const getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    // Check if job exists and user owns it
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applications for this job'
      });
    }

    // Build filter
    const filter = { job: jobId };
    if (status) {
      filter.status = status;
    }

    // Get applications
    const applications = await Application.find(filter)
      .populate([
        {
          path: 'applicant',
          select: 'firstName lastName email phone averageRating totalReviews skills experience profilePicture'
        },
        {
          path: 'job',
          select: 'title category budget'
        }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalApplications = await Application.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        applications,
        total: totalApplications,
        page,
        pages: Math.ceil(totalApplications / limit)
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/my-applications
// @access  Private (Workers only)
const getMyApplications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    // Build filter
    const filter = { applicant: req.user._id };
    if (status) {
      filter.status = status;
    }

    // Get applications
    const applications = await Application.find(filter)
      .populate([
        {
          path: 'job',
          select: 'title category budget duration location status',
          populate: {
            path: 'employer',
            select: 'firstName lastName companyName averageRating totalReviews'
          }
        }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalApplications = await Application.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        applications,
        total: totalApplications,
        page,
        pages: Math.ceil(totalApplications / limit)
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Job owner only)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const application = await Application.findById(id)
      .populate('job', 'employer');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user owns the job
    if (application.job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // Validate status transition
    const validStatuses = ['pending', 'viewed', 'shortlisted', 'interview', 'hired', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Update application status
    await application.updateStatus(status, note, req.user._id);

    // Populate updated application
    await application.populate([
      {
        path: 'applicant',
        select: 'firstName lastName email phone'
      },
      {
        path: 'job',
        select: 'title category'
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private (Applicant only)
const withdrawApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user owns the application
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this application'
      });
    }

    // Check if application can be withdrawn
    if (!application.canWithdraw()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw application at this stage'
      });
    }

    // Update status to withdrawn
    await application.updateStatus('withdrawn', 'Application withdrawn by applicant', req.user._id);

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private (Applicant or Job owner)
const getApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id)
      .populate([
        {
          path: 'job',
          populate: {
            path: 'employer',
            select: 'firstName lastName companyName averageRating totalReviews'
          }
        },
        {
          path: 'applicant',
          select: 'firstName lastName email phone averageRating totalReviews skills experience'
        }
      ]);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is authorized to view
    const isApplicant = application.applicant._id.toString() === req.user._id.toString();
    const isJobOwner = application.job.employer._id.toString() === req.user._id.toString();

    if (!isApplicant && !isJobOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get application statistics for employer
// @route   GET /api/applications/stats/employer
// @access  Private (Employers only)
const getEmployerApplicationStats = async (req, res, next) => {
  try {
    const stats = await Application.aggregate([
      {
        $match: { employer: req.user._id }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalApplications = await Application.countDocuments({ employer: req.user._id });

    const formattedStats = {
      total: totalApplications,
      pending: 0,
      viewed: 0,
      shortlisted: 0,
      interview: 0,
      hired: 0,
      rejected: 0,
      withdrawn: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
    });

    res.status(200).json({
      success: true,
      data: formattedStats
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyToJob,
  getJobApplications,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
  getApplication,
  getEmployerApplicationStats
};