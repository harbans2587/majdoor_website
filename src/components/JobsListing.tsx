'use client'

import { useState, useEffect } from 'react'

export function JobsListing() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs)
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="card text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
        <p className="text-gray-600 mb-4">
          Be the first to explore new opportunities when they become available.
        </p>
        <button className="btn-primary">
          Create Job Alert
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job: any) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  )
}

function JobCard({ job }: { job: any }) {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {job.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <span>{job.jobType}</span>
            <span>•</span>
            <span>{job.experienceLevel}</span>
            <span>•</span>
            <span>{job.location.type}</span>
            {job.location.city && (
              <>
                <span>•</span>
                <span>{job.location.city}</span>
              </>
            )}
          </div>
          <p className="text-gray-700 mb-4 line-clamp-3">
            {job.description}
          </p>
          <div className="flex items-center space-x-2 mb-4">
            {job.skillsRequired.slice(0, 4).map((skill: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
              >
                {skill}
              </span>
            ))}
            {job.skillsRequired.length > 4 && (
              <span className="text-sm text-gray-500">
                +{job.skillsRequired.length - 4} more
              </span>
            )}
          </div>
        </div>
        <div className="text-right ml-4">
          <div className="text-lg font-semibold text-green-600 mb-2">
            ${job.budget.min}
            {job.budget.max && job.budget.max !== job.budget.min && `-$${job.budget.max}`}
            {job.budget.type === 'hourly' ? '/hr' : ''}
          </div>
          <button className="btn-primary text-sm">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  )
}