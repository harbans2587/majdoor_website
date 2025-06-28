const Review = require('../models/Review');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { validationResult } = require('express-validator');

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
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

    const { revieweeId, jobId, applicationId, rating, title, comment, categories } = req.body;

    // Check if application exists and user is authorized
    const application = await Application.findById(applicationId)
      .populate('job', 'employer')
      .populate('applicant', '_id');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is authorized to review
    const isEmployer = application.job.employer.toString() === req.user._id.toString();
    const isWorker = application.applicant._id.toString() === req.user._id.toString();

    if (!isEmployer && !isWorker) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this application'
      });
    }

    // Determine review type
    let reviewType;
    if (isEmployer && revieweeId === application.applicant._id.toString()) {
      reviewType = 'employer_to_worker';
    } else if (isWorker && revieweeId === application.job.employer.toString()) {
      reviewType = 'worker_to_employer';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid reviewee for this application'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      reviewer: req.user._id,
      reviewee: revieweeId,
      job: jobId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this person for this job'
      });
    }

    // Create review
    const review = await Review.create({
      reviewer: req.user._id,
      reviewee: revieweeId,
      job: jobId,
      application: applicationId,
      rating,
      title,
      comment,
      categories,
      reviewType
    });

    // Update reviewee's rating
    const reviewee = await User.findById(revieweeId);
    await reviewee.updateRating();

    // Populate review data
    await review.populate([
      {
        path: 'reviewer',
        select: 'firstName lastName profilePicture'
      },
      {
        path: 'reviewee',
        select: 'firstName lastName'
      },
      {
        path: 'job',
        select: 'title category'
      }
    ]);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for user
// @route   GET /api/reviews/user/:userId
// @access  Public
const getUserReviews = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get reviews
    const reviews = await Review.find({
      reviewee: userId,
      isVisible: true
    })
      .populate([
        {
          path: 'reviewer',
          select: 'firstName lastName profilePicture'
        },
        {
          path: 'job',
          select: 'title category'
        }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({
      reviewee: userId,
      isVisible: true
    });

    // Get rating statistics
    const ratingStats = await Review.getAverageRating(userId);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        total: totalReviews,
        page,
        pages: Math.ceil(totalReviews / limit),
        ratingStats
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for job
// @route   GET /api/reviews/job/:jobId
// @access  Public
const getJobReviews = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Get reviews for this job
    const reviews = await Review.find({
      job: jobId,
      isVisible: true
    })
      .populate([
        {
          path: 'reviewer',
          select: 'firstName lastName profilePicture'
        },
        {
          path: 'reviewee',
          select: 'firstName lastName'
        }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({
      job: jobId,
      isVisible: true
    });

    res.status(200).json({
      success: true,
      data: {
        reviews,
        total: totalReviews,
        page,
        pages: Math.ceil(totalReviews / limit)
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private (Review owner only)
const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, title, comment, categories } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    // Update review
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { rating, title, comment, categories },
      { new: true, runValidators: true }
    ).populate([
      {
        path: 'reviewer',
        select: 'firstName lastName profilePicture'
      },
      {
        path: 'reviewee',
        select: 'firstName lastName'
      },
      {
        path: 'job',
        select: 'title category'
      }
    ]);

    // Update reviewee's rating
    const reviewee = await User.findById(review.reviewee);
    await reviewee.updateRating();

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Review owner only)
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await Review.findByIdAndDelete(id);

    // Update reviewee's rating
    const reviewee = await User.findById(review.reviewee);
    await reviewee.updateRating();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Flag review
// @route   POST /api/reviews/:id/flag
// @access  Private
const flagReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Flag review
    await review.flag(reason, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Review flagged for moderation'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Add helpful vote to review
// @route   POST /api/reviews/:id/vote
// @access  Private
const voteOnReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { helpful } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Add vote
    await review.addHelpfulVote(req.user._id, helpful);

    res.status(200).json({
      success: true,
      message: 'Vote recorded successfully',
      data: {
        helpfulVotes: review.helpfulVotes
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getUserReviews,
  getJobReviews,
  updateReview,
  deleteReview,
  flagReview,
  voteOnReview
};