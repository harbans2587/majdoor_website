const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { validationResult } = require('express-validator');

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email -resetPasswordToken -resetPasswordExpires -verificationToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
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

    const allowedFields = [
      'firstName', 'lastName', 'phone', 'bio', 'dateOfBirth', 'gender',
      'address', 'skills', 'experience', 'portfolio', 'availability',
      'hourlyRate', 'companyName', 'companySize', 'industry', 'companyDescription',
      'website', 'socialLinks', 'notificationSettings'
    ];

    // Filter out fields that shouldn't be updated
    const updateData = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get user's posted jobs (for employers)
// @route   GET /api/users/my-jobs
// @access  Private (Employers only)
const getMyJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    // Build filter
    const filter = { employer: req.user._id };
    if (status) {
      filter.status = status;
    }

    // Get jobs
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('employer', 'firstName lastName companyName');

    const totalJobs = await Job.countDocuments(filter);

    // Get application counts for each job
    const jobIds = jobs.map(job => job._id);
    const applicationCounts = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { 
        $group: { 
          _id: '$job', 
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          shortlisted: { $sum: { $cond: [{ $eq: ['$status', 'shortlisted'] }, 1, 0] } },
          hired: { $sum: { $cond: [{ $eq: ['$status', 'hired'] }, 1, 0] } }
        }
      }
    ]);

    // Add application stats to jobs
    const jobsWithStats = jobs.map(job => {
      const stats = applicationCounts.find(count => 
        count._id.toString() === job._id.toString()
      ) || { total: 0, pending: 0, shortlisted: 0, hired: 0 };
      
      return {
        ...job.toObject(),
        applicationStats: stats
      };
    });

    res.status(200).json({
      success: true,
      data: {
        jobs: jobsWithStats,
        total: totalJobs,
        page,
        pages: Math.ceil(totalJobs / limit)
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get user's applications (for workers)
// @route   GET /api/users/my-applications
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

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard-stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let stats = {};

    if (userRole === 'employer') {
      // Get employer stats
      const totalJobs = await Job.countDocuments({ employer: userId });
      const activeJobs = await Job.countDocuments({ employer: userId, status: 'active' });
      const totalApplications = await Application.countDocuments({ employer: userId });
      const pendingApplications = await Application.countDocuments({ 
        employer: userId, 
        status: 'pending' 
      });

      stats = {
        totalJobs,
        activeJobs,
        totalApplications,
        pendingApplications
      };

    } else if (userRole === 'worker') {
      // Get worker stats
      const totalApplications = await Application.countDocuments({ applicant: userId });
      const pendingApplications = await Application.countDocuments({ 
        applicant: userId, 
        status: 'pending' 
      });
      const interviewApplications = await Application.countDocuments({ 
        applicant: userId, 
        status: 'interview' 
      });
      const hiredApplications = await Application.countDocuments({ 
        applicant: userId, 
        status: 'hired' 
      });

      stats = {
        totalApplications,
        pendingApplications,
        interviewApplications,
        hiredApplications
      };
    }

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile picture
// @route   POST /api/users/profile-picture
// @access  Private
const uploadProfilePicture = async (req, res, next) => {
  try {
    // TODO: Implement file upload logic with multer and cloudinary
    res.status(200).json({
      success: true,
      message: 'Profile picture upload - Coming soon'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get users for search (workers/employers)
// @route   GET /api/users/search
// @access  Public
const searchUsers = async (req, res, next) => {
  try {
    const {
      q,
      role,
      location,
      skills,
      rating_min,
      page = 1,
      limit = 10
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build filter
    const filter = {};
    
    if (role) {
      filter.role = role;
    }
    
    if (location) {
      filter['address.city'] = new RegExp(location, 'i');
    }
    
    if (skills) {
      const skillsArray = skills.split(',');
      filter['skills.name'] = { $in: skillsArray };
    }
    
    if (rating_min) {
      filter.averageRating = { $gte: parseFloat(rating_min) };
    }
    
    if (q) {
      filter.$or = [
        { firstName: new RegExp(q, 'i') },
        { lastName: new RegExp(q, 'i') },
        { bio: new RegExp(q, 'i') },
        { companyName: new RegExp(q, 'i') }
      ];
    }

    // Get users
    const users = await User.find(filter)
      .select('-password -email -resetPasswordToken -resetPasswordExpires -verificationToken')
      .sort({ averageRating: -1, totalReviews: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        users,
        total: totalUsers,
        page: parseInt(page),
        pages: Math.ceil(totalUsers / parseInt(limit))
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update user availability (for workers)
// @route   PUT /api/users/availability
// @access  Private (Workers only)
const updateAvailability = async (req, res, next) => {
  try {
    const { availability } = req.body;
    
    if (!['available', 'busy', 'not_available'].includes(availability)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid availability status'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { availability },
      { new: true }
    ).select('availability');

    res.status(200).json({
      success: true,
      message: 'Availability updated successfully',
      data: { availability: user.availability }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  getMyJobs,
  getMyApplications,
  getDashboardStats,
  uploadProfilePicture,
  searchUsers,
  updateAvailability
};