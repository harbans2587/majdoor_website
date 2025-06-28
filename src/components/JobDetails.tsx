interface JobDetailsProps {
  job: any
  employerProfile: any
}

export function JobDetails({ job, employerProfile }: JobDetailsProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Job Header */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="capitalize">{job.jobType}</span>
              <span>•</span>
              <span className="capitalize">{job.experienceLevel}</span>
              <span>•</span>
              <span className="capitalize">{job.location.type}</span>
              {job.location.city && (
                <>
                  <span>•</span>
                  <span>{job.location.city}</span>
                </>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-green-600">
              ${job.budget.min}
              {job.budget.max && job.budget.max !== job.budget.min && `-$${job.budget.max}`}
              {job.budget.type === 'hourly' ? '/hr' : ''}
            </div>
            <div className="text-sm text-gray-500">
              Posted {formatDate(job.createdAt)}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {job.skillsRequired.map((skill: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Job Description */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </div>
      </div>

      {/* Requirements */}
      {job.requirements && job.requirements.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
          <ul className="space-y-2">
            {job.requirements.map((requirement: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✓</span>
                <span className="text-gray-700">{requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Company Info */}
      {employerProfile && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Company</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-medium text-gray-900">{employerProfile.companyName}</h3>
              <p className="text-sm text-gray-600">{employerProfile.industry}</p>
            </div>
            <p className="text-gray-700">{employerProfile.companyDescription}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{employerProfile.companySize}</span>
              {employerProfile.location.city && (
                <>
                  <span>•</span>
                  <span>{employerProfile.location.city}, {employerProfile.location.country}</span>
                </>
              )}
              {employerProfile.website && (
                <>
                  <span>•</span>
                  <a 
                    href={employerProfile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-500"
                  >
                    Website
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Job Details */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {job.duration && (
            <div>
              <span className="font-medium text-gray-700">Duration:</span>
              <span className="ml-2 text-gray-600">{job.duration}</span>
            </div>
          )}
          {job.deadline && (
            <div>
              <span className="font-medium text-gray-700">Application Deadline:</span>
              <span className="ml-2 text-gray-600">{formatDate(job.deadline)}</span>
            </div>
          )}
          <div>
            <span className="font-medium text-gray-700">Applications:</span>
            <span className="ml-2 text-gray-600">{job.applicationsCount}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Job Status:</span>
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
              job.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}