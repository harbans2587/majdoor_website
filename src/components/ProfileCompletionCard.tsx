'use client'

import Link from 'next/link'

interface ProfileCompletionCardProps {
  userType: string
}

export function ProfileCompletionCard({ userType }: ProfileCompletionCardProps) {
  const completionSteps = userType === 'worker' 
    ? [
        'Add your professional title',
        'Write a compelling bio',
        'List your key skills',
        'Add work experience',
        'Set your hourly rate'
      ]
    : [
        'Add company information',
        'Write company description',
        'Specify your industry',
        'Add contact details',
        'Upload company logo'
      ]

  return (
    <div className="card bg-blue-50 border-blue-200">
      <h3 className="text-lg font-medium text-blue-900 mb-4">
        Complete Your Profile
      </h3>
      <p className="text-blue-700 mb-4">
        {userType === 'worker' 
          ? 'A complete profile gets 5x more job opportunities!'
          : 'A complete profile attracts better candidates!'
        }
      </p>
      
      <div className="space-y-2 mb-6">
        {completionSteps.slice(0, 3).map((step, index) => (
          <div key={index} className="flex items-center text-sm text-blue-700">
            <span className="w-4 h-4 bg-blue-200 rounded-full mr-2 flex items-center justify-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            </span>
            {step}
          </div>
        ))}
        {completionSteps.length > 3 && (
          <p className="text-xs text-blue-600 pl-6">
            +{completionSteps.length - 3} more steps
          </p>
        )}
      </div>

      <Link
        href="/profile"
        className="btn-primary w-full text-center bg-blue-600 hover:bg-blue-700"
      >
        Complete Profile
      </Link>
    </div>
  )
}