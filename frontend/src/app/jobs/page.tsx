'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  BriefcaseIcon,
  StarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Mock job data - in real app this would come from API
const mockJobs = [
  {
    _id: '1',
    title: 'Construction Worker for Residential Building',
    description: 'We need experienced construction workers for a 3-month residential building project. Must have experience with concrete work and basic carpentry.',
    category: 'construction',
    employer: {
      _id: 'emp1',
      firstName: 'Rajesh',
      lastName: 'Kumar',
      companyName: 'Kumar Construction',
      averageRating: 4.5,
      totalReviews: 23
    },
    location: {
      address: {
        city: 'Delhi',
        state: 'Delhi',
        country: 'India'
      }
    },
    budget: {
      amount: 600,
      currency: 'INR',
      type: 'daily'
    },
    duration: 'temporary',
    startDate: '2024-02-01',
    status: 'active',
    requirements: ['2+ years experience', 'Own basic tools', 'Physical fitness'],
    skills: ['construction', 'carpentry', 'concrete work'],
    featured: true,
    urgent: false,
    applicationsCount: 12,
    viewsCount: 45,
    createdAt: '2024-01-15T10:00:00.000Z'
  },
  {
    _id: '2',
    title: 'House Cleaning Service',
    description: 'Looking for reliable cleaning professionals for regular house cleaning. Flexible hours and competitive pay.',
    category: 'cleaning',
    employer: {
      _id: 'emp2',
      firstName: 'Priya',
      lastName: 'Sharma',
      averageRating: 4.8,
      totalReviews: 15
    },
    location: {
      address: {
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India'
      }
    },
    budget: {
      amount: 300,
      currency: 'INR',
      type: 'daily'
    },
    duration: 'permanent',
    startDate: '2024-01-25',
    status: 'active',
    requirements: ['Experience in house cleaning', 'Reliable and punctual'],
    skills: ['cleaning', 'organizing'],
    featured: false,
    urgent: true,
    applicationsCount: 8,
    viewsCount: 32,
    createdAt: '2024-01-18T14:30:00.000Z'
  },
  {
    _id: '3',
    title: 'Delivery Executive - Food & Groceries',
    description: 'Join our delivery team for food and grocery delivery. Own vehicle preferred. Flexible shifts available.',
    category: 'delivery',
    employer: {
      _id: 'emp3',
      firstName: 'Amit',
      lastName: 'Patel',
      companyName: 'QuickDelivery Services',
      averageRating: 4.2,
      totalReviews: 56
    },
    location: {
      address: {
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India'
      }
    },
    budget: {
      amount: 25000,
      currency: 'INR',
      type: 'monthly'
    },
    duration: 'permanent',
    startDate: '2024-02-05',
    status: 'active',
    requirements: ['Own bike/scooter', 'Valid driving license', 'Good navigation skills'],
    skills: ['driving', 'customer service'],
    featured: false,
    urgent: false,
    applicationsCount: 34,
    viewsCount: 89,
    createdAt: '2024-01-20T09:15:00.000Z'
  }
];

export default function JobsPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const formatBudget = (budget: any) => {
    return `₹${budget.amount.toLocaleString()}/${budget.type}`;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                Majdoor
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/jobs" className="text-primary-600 font-medium">
                Find Jobs
              </Link>
              <Link href="/workers" className="text-gray-700 hover:text-primary-600">
                Find Workers
              </Link>
              <Link href="/how-it-works" className="text-gray-700 hover:text-primary-600">
                How It Works
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-primary-600">
                    Dashboard
                  </Link>
                  <span className="text-sm text-gray-600">
                    {user?.firstName} {user?.lastName}
                  </span>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-gray-700 hover:text-primary-600">
                    Login
                  </Link>
                  <Link href="/auth/register" className="btn-primary">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Jobs</h1>
          <p className="text-gray-600">Discover opportunities that match your skills and location</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <input
                type="text"
                placeholder="Search jobs..."
                className="input-field"
              />
            </div>
            <div>
              <select className="input-field">
                <option value="">All Categories</option>
                <option value="construction">Construction</option>
                <option value="cleaning">Cleaning</option>
                <option value="delivery">Delivery</option>
                <option value="cooking">Cooking</option>
                <option value="gardening">Gardening</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                placeholder="Location"
                className="input-field"
              />
            </div>
            <div>
              <button className="btn-primary w-full">
                <MagnifyingGlassIcon className="w-5 h-5 inline mr-2" />
                Search
              </button>
            </div>
          </div>
          
          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="form-label">Duration</label>
              <select className="input-field">
                <option value="">Any Duration</option>
                <option value="one_time">One Time</option>
                <option value="temporary">Temporary</option>
                <option value="permanent">Permanent</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="form-label">Budget Type</label>
              <select className="input-field">
                <option value="">Any Budget</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
            <div>
              <label className="form-label">Min Budget (₹)</label>
              <input
                type="number"
                placeholder="Min amount"
                className="input-field"
              />
            </div>
            <div>
              <label className="form-label">Max Budget (₹)</label>
              <input
                type="number"
                placeholder="Max amount"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600">
            Showing {mockJobs.length} jobs
          </div>
          <div>
            <select className="input-field">
              <option value="relevance">Most Relevant</option>
              <option value="date">Latest</option>
              <option value="budget_high">Highest Budget</option>
              <option value="budget_low">Lowest Budget</option>
            </select>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {mockJobs.map((job) => (
            <div key={job._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600">
                        <Link href={`/jobs/${job._id}`}>
                          {job.title}
                        </Link>
                      </h3>
                      {job.featured && (
                        <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                      {job.urgent && (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                          Urgent
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <span className="font-medium">
                        {job.employer.companyName || `${job.employer.firstName} ${job.employer.lastName}`}
                      </span>
                      <div className="flex items-center ml-3">
                        <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{job.employer.averageRating}</span>
                        <span className="ml-1">({job.employer.totalReviews} reviews)</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {job.location.address.city}, {job.location.address.state}
                      </div>
                      <div className="flex items-center">
                        <CurrencyRupeeIcon className="w-4 h-4 mr-1" />
                        {formatBudget(job.budget)}
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {job.duration}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {getTimeAgo(job.createdAt)}
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{job.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end ml-6">
                    <div className="text-right mb-4">
                      <div className="text-2xl font-bold text-gray-900">
                        ₹{job.budget.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        per {job.budget.type}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {isAuthenticated && user?.role === 'worker' ? (
                        <button className="btn-primary">
                          Apply Now
                        </button>
                      ) : (
                        <Link href="/auth/register?role=worker" className="btn-primary">
                          Apply Now
                        </Link>
                      )}
                      <Link href={`/jobs/${job._id}`} className="btn-outline block text-center">
                        View Details
                      </Link>
                    </div>

                    <div className="text-xs text-gray-500 mt-3 text-right">
                      {job.applicationsCount} applications
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-2 text-sm font-medium text-white bg-primary-600 border border-primary-600 rounded-md">
              1
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Next
            </button>
          </nav>
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="mt-16 bg-primary-600 rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Working?</h2>
            <p className="text-primary-100 mb-6">
              Join thousands of workers finding opportunities on Majdoor
            </p>
            <Link href="/auth/register?role=worker" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-md transition-colors">
              Sign Up Today
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}