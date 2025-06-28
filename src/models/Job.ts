import mongoose, { Schema, Document } from 'mongoose'

export interface IJob extends Document {
  employerId: mongoose.Types.ObjectId
  title: string
  description: string
  requirements: string[]
  skillsRequired: string[]
  jobType: 'full-time' | 'part-time' | 'contract' | 'freelance'
  experienceLevel: 'entry' | 'intermediate' | 'senior'
  budget: {
    type: 'hourly' | 'fixed'
    min: number
    max?: number
  }
  location: {
    type: 'remote' | 'onsite' | 'hybrid'
    city?: string
    state?: string
    country?: string
  }
  duration?: string
  applicationsCount: number
  status: 'active' | 'closed' | 'filled'
  featured: boolean
  deadline?: Date
  createdAt: Date
  updatedAt: Date
}

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId
  workerId: mongoose.Types.ObjectId
  employerId: mongoose.Types.ObjectId
  coverLetter: string
  proposedRate?: number
  estimatedDuration?: string
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  appliedAt: Date
  respondedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface IReview extends Document {
  reviewerId: mongoose.Types.ObjectId
  revieweeId: mongoose.Types.ObjectId
  jobId: mongoose.Types.ObjectId
  rating: number
  comment: string
  reviewType: 'worker-to-employer' | 'employer-to-worker'
  createdAt: Date
}

const JobSchema = new Schema<IJob>({
  employerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  skillsRequired: [{ type: String }],
  jobType: { 
    type: String, 
    enum: ['full-time', 'part-time', 'contract', 'freelance'],
    required: true 
  },
  experienceLevel: { 
    type: String, 
    enum: ['entry', 'intermediate', 'senior'],
    required: true 
  },
  budget: {
    type: { type: String, enum: ['hourly', 'fixed'], required: true },
    min: { type: Number, required: true },
    max: Number
  },
  location: {
    type: { type: String, enum: ['remote', 'onsite', 'hybrid'], required: true },
    city: String,
    state: String,
    country: String
  },
  duration: String,
  applicationsCount: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['active', 'closed', 'filled'],
    default: 'active' 
  },
  featured: { type: Boolean, default: false },
  deadline: Date
}, {
  timestamps: true
})

const ApplicationSchema = new Schema<IApplication>({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  workerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  employerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, required: true },
  proposedRate: Number,
  estimatedDuration: String,
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending' 
  },
  appliedAt: { type: Date, default: Date.now },
  respondedAt: Date
}, {
  timestamps: true
})

const ReviewSchema = new Schema<IReview>({
  reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  revieweeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  reviewType: { 
    type: String, 
    enum: ['worker-to-employer', 'employer-to-worker'],
    required: true 
  }
}, {
  timestamps: true
})

export const Job = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema)
export const Application = mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema)
export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema)