const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'construction',
      'cleaning',
      'delivery',
      'cooking',
      'gardening',
      'plumbing',
      'electrical',
      'painting',
      'carpentry',
      'moving',
      'security',
      'babysitting',
      'elderly_care',
      'tutoring',
      'data_entry',
      'photography',
      'event_planning',
      'maintenance',
      'other'
    ]
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Job Details
  requirements: [String],
  responsibilities: [String],
  skills: [String],
  experience: {
    type: String,
    enum: ['entry', '1-2_years', '3-5_years', '5+_years'],
    default: 'entry'
  },
  
  // Location
  location: {
    address: {
      street: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: String,
      country: { type: String, default: 'India' }
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    isRemote: { type: Boolean, default: false }
  },
  
  // Budget and Payment
  budget: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    type: {
      type: String,
      enum: ['hourly', 'daily', 'weekly', 'monthly', 'fixed'],
      required: true
    }
  },
  
  // Duration and Schedule
  duration: {
    type: String,
    enum: ['one_time', 'temporary', 'permanent', 'contract'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  workingHours: {
    start: String, // "09:00"
    end: String,   // "17:00"
    daysPerWeek: Number,
    flexible: { type: Boolean, default: false }
  },
  
  // Application settings
  applicationDeadline: Date,
  maxApplications: {
    type: Number,
    default: 50
  },
  
  // Job Status
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'filled', 'cancelled', 'expired'],
    default: 'draft'
  },
  
  // Visibility and Promotion
  visibility: {
    type: String,
    enum: ['public', 'private', 'featured'],
    default: 'public'
  },
  featured: {
    type: Boolean,
    default: false
  },
  urgent: {
    type: Boolean,
    default: false
  },
  
  // Application Tracking
  applicationsCount: {
    type: Number,
    default: 0
  },
  viewsCount: {
    type: Number,
    default: 0
  },
  
  // Additional Information
  benefits: [String],
  contactInfo: {
    phone: String,
    email: String,
    preferredContact: {
      type: String,
      enum: ['phone', 'email', 'app'],
      default: 'app'
    }
  },
  
  // Images and Documents
  images: [String],
  documents: [String],
  
  // SEO and Search
  tags: [String],
  searchKeywords: [String]
}, {
  timestamps: true
});

// Middleware to update search keywords
jobSchema.pre('save', function(next) {
  // Generate search keywords from title, description, skills, and category
  const keywords = [
    ...this.title.toLowerCase().split(' '),
    ...this.description.toLowerCase().split(' '),
    ...this.skills.map(skill => skill.toLowerCase()),
    this.category.toLowerCase(),
    this.location.address.city.toLowerCase(),
    this.location.address.state.toLowerCase()
  ].filter(keyword => keyword.length > 2); // Filter out short words
  
  this.searchKeywords = [...new Set(keywords)]; // Remove duplicates
  next();
});

// Method to check if job is expired
jobSchema.methods.isExpired = function() {
  if (this.applicationDeadline) {
    return new Date() > this.applicationDeadline;
  }
  // Auto-expire after 30 days if no deadline set
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return this.createdAt < thirtyDaysAgo;
};

// Method to increment views
jobSchema.methods.incrementViews = function() {
  this.viewsCount += 1;
  return this.save();
};

// Method to increment applications
jobSchema.methods.incrementApplications = function() {
  this.applicationsCount += 1;
  return this.save();
};

// Virtual for formatted budget
jobSchema.virtual('formattedBudget').get(function() {
  const symbol = this.budget.currency === 'INR' ? '₹' : '$';
  return `${symbol}${this.budget.amount}/${this.budget.type}`;
});

// Indexes for performance and search
jobSchema.index({ employer: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ 'location.coordinates': '2dsphere' });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ startDate: 1 });
jobSchema.index({ applicationDeadline: 1 });
jobSchema.index({ searchKeywords: 1 });
jobSchema.index({ 'budget.amount': 1 });
jobSchema.index({ featured: -1, urgent: -1, createdAt: -1 });

// Text index for search
jobSchema.index({
  title: 'text',
  description: 'text',
  searchKeywords: 'text'
}, {
  weights: {
    title: 10,
    searchKeywords: 5,
    description: 1
  }
});

module.exports = mongoose.model('Job', jobSchema);