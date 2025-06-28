const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  
  // Rating and Review
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    maxlength: 100
  },
  comment: {
    type: String,
    maxlength: 1000
  },
  
  // Detailed Ratings
  categories: {
    punctuality: { type: Number, min: 1, max: 5 },
    quality: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    professionalism: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 } // For employers: value for money, For workers: fair payment
  },
  
  // Review Type
  reviewType: {
    type: String,
    enum: ['worker_to_employer', 'employer_to_worker'],
    required: true
  },
  
  // Moderation
  isVisible: {
    type: Boolean,
    default: true
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  flagReason: String,
  moderatorNote: String,
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: Date,
  
  // Responses
  response: {
    comment: String,
    respondedAt: Date
  },
  
  // Helpful votes
  helpfulVotes: {
    type: Number,
    default: 0
  },
  votedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    helpful: Boolean,
    votedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Ensure one review per job per user pair
reviewSchema.index({ 
  reviewer: 1, 
  reviewee: 1, 
  job: 1 
}, { unique: true });

// Other indexes
reviewSchema.index({ reviewee: 1, isVisible: 1, createdAt: -1 });
reviewSchema.index({ reviewer: 1, createdAt: -1 });
reviewSchema.index({ job: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ isFlagged: 1 });

// Method to calculate average category rating
reviewSchema.methods.getAverageCategoryRating = function() {
  const categories = this.categories;
  const values = Object.values(categories).filter(val => val != null);
  return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
};

// Method to flag review
reviewSchema.methods.flag = function(reason, flaggedBy) {
  this.isFlagged = true;
  this.flagReason = reason;
  this.isVisible = false; // Hide flagged reviews by default
  return this.save();
};

// Method to add helpful vote
reviewSchema.methods.addHelpfulVote = function(userId, isHelpful) {
  // Remove existing vote if any
  this.votedBy = this.votedBy.filter(vote => !vote.user.equals(userId));
  
  // Add new vote
  this.votedBy.push({
    user: userId,
    helpful: isHelpful,
    votedAt: new Date()
  });
  
  // Recalculate helpful votes
  this.helpfulVotes = this.votedBy.filter(vote => vote.helpful).length;
  
  return this.save();
};

// Virtual for formatted date
reviewSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Static method to get average rating for a user
reviewSchema.statics.getAverageRating = async function(userId) {
  const result = await this.aggregate([
    { 
      $match: { 
        reviewee: mongoose.Types.ObjectId(userId),
        isVisible: true 
      } 
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);
  
  if (result.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }
  
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  result[0].ratingDistribution.forEach(rating => {
    distribution[rating]++;
  });
  
  return {
    averageRating: Math.round(result[0].averageRating * 10) / 10,
    totalReviews: result[0].totalReviews,
    ratingDistribution: distribution
  };
};

module.exports = mongoose.model('Review', reviewSchema);