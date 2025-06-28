'use client'

import Link from 'next/link'

interface RecentJobsProps {
  userType: string
}

export function RecentJobs({ userType }: RecentJobsProps) {
  // This would normally fetch from an API
  const jobs: any[] = []

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {userType === 'worker' ? 'Recommended Jobs' : 'Your Recent Jobs'}
        </h3>
        <Link 
          href="/jobs" 
          className="text-primary-600 hover:text-primary-500 text-sm font-medium"
        >
          View all
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">
            {userType === 'worker' 
              ? 'No jobs to show yet. Complete your profile to get personalized recommendations.'
              : 'You haven\'t posted any jobs yet.'
            }
          </p>
          <Link
            href={userType === 'worker' ? '/profile' : '/post-job'}
            className="btn-primary"
          >
            {userType === 'worker' ? 'Complete Profile' : 'Post Your First Job'}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job: any) => (
            <div key={job.id} className="border border-gray-200 rounded-lg p-4">
              {/* Job card content would go here */}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}