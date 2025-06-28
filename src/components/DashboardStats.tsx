'use client'

import Link from 'next/link'

interface DashboardStatsProps {
  userType: string
}

export function DashboardStats({ userType }: DashboardStatsProps) {
  const workerStats = [
    { name: 'Applied Jobs', value: '0', icon: '📝' },
    { name: 'Profile Views', value: '0', icon: '👁️' },
    { name: 'Completed Jobs', value: '0', icon: '✅' },
    { name: 'Earnings', value: '$0', icon: '💰' },
  ]

  const employerStats = [
    { name: 'Active Jobs', value: '0', icon: '📋' },
    { name: 'Total Applications', value: '0', icon: '📨' },
    { name: 'Hired Workers', value: '0', icon: '👥' },
    { name: 'Jobs Posted', value: '0', icon: '📢' },
  ]

  const stats = userType === 'worker' ? workerStats : employerStats

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          {userType === 'worker' ? 'Your Activity' : 'Your Metrics'}
        </h3>
        <Link 
          href={userType === 'worker' ? '/jobs' : '/post-job'}
          className="btn-primary text-sm"
        >
          {userType === 'worker' ? 'Browse Jobs' : 'Post New Job'}
        </Link>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{stat.icon}</span>
              <div>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}