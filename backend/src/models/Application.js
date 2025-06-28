const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Application Details
  coverLetter: {
    type: String,
    maxlength: 1000
  },
  proposedRate: {
    amount: Number,
    currency: { type: String, default: 'INR' },
    type: String // hourly, daily, fixed
  },
  availability: {
    startDate: Date,
    endDate: Date,
    workingHours: String,
    flexible: { type: Boolean, default: false }
  },
  
  // Status Tracking
  status: {
    type: String,
    enum: [
      'pending',      // Just applied
      'viewed',       // Employer viewed application
      'shortlisted',  // Employer shortlisted
      'interview',    // Interview scheduled
      'hired',        // Worker hired
      'rejected',     // Application rejected
      'withdrawn'     // Worker withdrew application
    ],
    default: 'pending'
  },
  
  // Timeline
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Interview Details
  interview: {
    scheduled: { type: Boolean, default: false },
    date: Date,
    time: String,
    location: String,
    type: {
      type: String,
      enum: ['in_person', 'phone', 'video', 'chat']
    },
    notes: String
  },
  
  // Documents and Portfolio
  attachments: [{
    name: String,
    url: String,
    type: String, // resume, portfolio, certificate, etc.
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Communication
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  unreadMessages: {
    type: Number,
    default: 0
  },
  
  // Employer Notes
  employerNotes: String,
  
  // Rating (after job completion)
  rating: {
    workerRating: {
      rating: { type: Number, min: 1, max: 5 },
      review: String,
      ratedAt: Date
    },
    employerRating: {
      rating: { type: Number, min: 1, max: 5 },
      review: String,
      ratedAt: Date
    }
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

// Other indexes for performance
applicationSchema.index({ employer: 1, status: 1, createdAt: -1 });
applicationSchema.index({ applicant: 1, status: 1, createdAt: -1 });
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ createdAt: -1 });

// Method to update status with history
applicationSchema.methods.updateStatus = function(newStatus, note, updatedBy) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    note: note,
    updatedBy: updatedBy,
    timestamp: new Date()
  });
  return this.save();
};

// Method to check if application can be withdrawn
applicationSchema.methods.canWithdraw = function() {
  return ['pending', 'viewed', 'shortlisted'].includes(this.status);
};

// Method to check if application can be edited
applicationSchema.methods.canEdit = function() {
  return this.status === 'pending';
};

// Virtual for time since application
applicationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return hours === 0 ? 'Just now' : `${hours}h ago`;
  } else if (days === 1) {
    return '1 day ago';
  } else {
    return `${days} days ago`;
  }
});

module.exports = mongoose.model('Application', applicationSchema);