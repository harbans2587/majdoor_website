import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  name: string
  userType: 'worker' | 'employer'
  profileComplete: boolean
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IWorkerProfile extends Document {
  userId: mongoose.Types.ObjectId
  title: string
  bio: string
  skills: string[]
  experience: {
    company: string
    position: string
    duration: string
    description: string
  }[]
  education: {
    institution: string
    degree: string
    year: string
  }[]
  portfolio: {
    title: string
    description: string
    url: string
  }[]
  hourlyRate: number
  availability: 'full-time' | 'part-time' | 'contract' | 'freelance'
  location: {
    city: string
    state: string
    country: string
  }
  rating: number
  totalJobs: number
  profileImage?: string
  verified: boolean
}

export interface IEmployerProfile extends Document {
  userId: mongoose.Types.ObjectId
  companyName: string
  companyDescription: string
  industry: string
  companySize: string
  website?: string
  location: {
    city: string
    state: string
    country: string
  }
  contactPerson: string
  contactEmail: string
  contactPhone?: string
  verified: boolean
  rating: number
  totalJobs: number
  companyLogo?: string
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  userType: { type: String, enum: ['worker', 'employer'], required: true },
  profileComplete: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
}, {
  timestamps: true
})

const WorkerProfileSchema = new Schema<IWorkerProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  bio: { type: String, required: true },
  skills: [{ type: String }],
  experience: [{
    company: String,
    position: String,
    duration: String,
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    year: String
  }],
  portfolio: [{
    title: String,
    description: String,
    url: String
  }],
  hourlyRate: { type: Number, default: 0 },
  availability: { 
    type: String, 
    enum: ['full-time', 'part-time', 'contract', 'freelance'],
    default: 'full-time'
  },
  location: {
    city: String,
    state: String,
    country: String
  },
  rating: { type: Number, default: 0 },
  totalJobs: { type: Number, default: 0 },
  profileImage: String,
  verified: { type: Boolean, default: false }
}, {
  timestamps: true
})

const EmployerProfileSchema = new Schema<IEmployerProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  companyDescription: { type: String, required: true },
  industry: { type: String, required: true },
  companySize: { type: String, required: true },
  website: String,
  location: {
    city: String,
    state: String,
    country: String
  },
  contactPerson: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPhone: String,
  verified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  totalJobs: { type: Number, default: 0 },
  companyLogo: String
}, {
  timestamps: true
})

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
export const WorkerProfile = mongoose.models.WorkerProfile || mongoose.model<IWorkerProfile>('WorkerProfile', WorkerProfileSchema)
export const EmployerProfile = mongoose.models.EmployerProfile || mongoose.model<IEmployerProfile>('EmployerProfile', EmployerProfileSchema)