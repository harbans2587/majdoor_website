const Job = require('../models/Job');
const { validationResult } = require('express-validator');

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { status: 'active' };
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.location) {
      filter['location.address.city'] = new RegExp(req.query.location, 'i');
    }
    
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }
    
    if (req.query.budget_min || req.query.budget_max) {
      filter['budget.amount'] = {};
      if (req.query.budget_min) {
        filter['budget.amount'].$gte = parseFloat(req.query.budget_min);
      }
      if (req.query.budget_max) {
        filter['budget.amount'].$lte = parseFloat(req.query.budget_max);
      }
    }
    
    if (req.query.duration) {
      filter.duration = req.query.duration;
    }

    // Execute query
    const jobs = await Job.find(filter)
      .populate('employer', 'firstName lastName companyName averageRating totalReviews')
      .sort({ featured: -1, urgent: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalJobs = await Job.countDocuments(filter);
    const totalPages = Math.ceil(totalJobs / limit);

    // Increment view count for each job (in the background)
    if (jobs.length > 0) {
      Job.updateMany(
        { _id: { $in: jobs.map(job => job._id) } },
        { $inc: { viewsCount: 1 } }
      ).exec();
    }

    res.status(200).json({
      success: true,
      data: {
        jobs,
        total: totalJobs,
        page,
        pages: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'firstName lastName companyName averageRating totalReviews isVerifiedEmployer');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment view count
    await job.incrementViews();

    res.status(200).json({
      success: true,
      data: job
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Employers only)
const createJob = async (req, res, next) => {
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

    // Add employer to job data
    const jobData = {
      ...req.body,
      employer: req.user._id
    };

    // Create job
    const job = await Job.create(jobData);
    
    // Populate employer data
    await job.populate('employer', 'firstName lastName companyName averageRating totalReviews');

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Job owner only)
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user owns the job
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    // Update job
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('employer', 'firstName lastName companyName averageRating totalReviews');

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Job owner only)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user owns the job
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs by employer
// @route   GET /api/jobs/employer/:employerId
// @access  Public
const getJobsByEmployer = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const jobs = await Job.find({ 
      employer: req.params.employerId,
      status: { $ne: 'draft' }
    })
      .populate('employer', 'firstName lastName companyName averageRating totalReviews')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalJobs = await Job.countDocuments({ 
      employer: req.params.employerId,
      status: { $ne: 'draft' }
    });

    res.status(200).json({
      success: true,
      data: {
        jobs,
        total: totalJobs,
        page,
        pages: Math.ceil(totalJobs / limit)
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Search jobs with advanced filters
// @route   GET /api/jobs/search
// @access  Public
const searchJobs = async (req, res, next) => {
  try {
    const {
      q,
      category,
      location,
      budget_min,
      budget_max,
      duration,
      sort_by = 'relevance',
      page = 1,
      limit = 10
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build aggregation pipeline
    const pipeline = [];
    
    // Match stage
    const matchStage = { status: 'active' };
    
    if (q) {
      matchStage.$text = { $search: q };
    }
    
    if (category) {
      matchStage.category = category;
    }
    
    if (location) {
      matchStage['location.address.city'] = new RegExp(location, 'i');
    }
    
    if (budget_min || budget_max) {
      matchStage['budget.amount'] = {};
      if (budget_min) matchStage['budget.amount'].$gte = parseFloat(budget_min);
      if (budget_max) matchStage['budget.amount'].$lte = parseFloat(budget_max);
    }
    
    if (duration) {
      matchStage.duration = duration;
    }
    
    pipeline.push({ $match: matchStage });
    
    // Add score for text search
    if (q) {
      pipeline.push({ $addFields: { score: { $meta: 'textScore' } } });
    }
    
    // Sort stage
    let sortStage = {};
    switch (sort_by) {
      case 'date':
        sortStage = { createdAt: -1 };
        break;
      case 'budget_high':
        sortStage = { 'budget.amount': -1 };
        break;
      case 'budget_low':
        sortStage = { 'budget.amount': 1 };
        break;
      case 'relevance':
      default:
        if (q) {
          sortStage = { score: { $meta: 'textScore' }, featured: -1, urgent: -1 };
        } else {
          sortStage = { featured: -1, urgent: -1, createdAt: -1 };
        }
    }
    
    pipeline.push({ $sort: sortStage });
    
    // Pagination
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: parseInt(limit) });
    
    // Populate employer
    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'employer',
        foreignField: '_id',
        as: 'employer',
        pipeline: [
          {
            $project: {
              firstName: 1,
              lastName: 1,
              companyName: 1,
              averageRating: 1,
              totalReviews: 1,
              isVerifiedEmployer: 1
            }
          }
        ]
      }
    });
    
    pipeline.push({
      $unwind: '$employer'
    });

    const jobs = await Job.aggregate(pipeline);
    
    // Get total count for pagination
    const countPipeline = pipeline.slice(0, -3); // Remove skip, limit, and lookup stages
    const totalResult = await Job.aggregate([
      ...countPipeline,
      { $count: 'total' }
    ]);
    
    const totalJobs = totalResult.length > 0 ? totalResult[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        jobs,
        total: totalJobs,
        page: parseInt(page),
        pages: Math.ceil(totalJobs / parseInt(limit)),
        filters: {
          category,
          location,
          budget_min,
          budget_max,
          duration,
          sort_by
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobsByEmployer,
  searchJobs
};