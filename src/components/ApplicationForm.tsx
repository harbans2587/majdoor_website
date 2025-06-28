'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ApplicationFormProps {
  jobId: string
  employerId: string
}

export function ApplicationForm({ jobId, employerId }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    coverLetter: '',
    proposedRate: '',
    estimatedDuration: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [applied, setApplied] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobId,
          employerId,
          coverLetter: formData.coverLetter,
          proposedRate: formData.proposedRate ? parseFloat(formData.proposedRate) : undefined,
          estimatedDuration: formData.estimatedDuration || undefined
        })
      })

      if (response.ok) {
        setMessage('Application submitted successfully!')
        setApplied(true)
        setTimeout(() => router.push('/dashboard'), 3000)
      } else {
        const error = await response.json()
        setMessage(error.error || 'Failed to submit application')
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (applied) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="text-green-500 text-4xl mb-4">✓</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Application Submitted!
          </h3>
          <p className="text-gray-600 mb-4">
            Your application has been sent to the employer. You'll be notified of any updates.
          </p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Apply for this job
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div className={`p-3 rounded-md text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* Cover Letter */}
        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
            Cover Letter *
          </label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            required
            rows={6}
            value={formData.coverLetter}
            onChange={handleChange}
            placeholder="Introduce yourself and explain why you're perfect for this job..."
            className="input-field text-sm"
          />
        </div>

        {/* Proposed Rate */}
        <div>
          <label htmlFor="proposedRate" className="block text-sm font-medium text-gray-700 mb-1">
            Proposed Rate ($/hr)
          </label>
          <input
            type="number"
            id="proposedRate"
            name="proposedRate"
            value={formData.proposedRate}
            onChange={handleChange}
            placeholder="25"
            className="input-field text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional: Suggest your hourly rate
          </p>
        </div>

        {/* Estimated Duration */}
        <div>
          <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Duration
          </label>
          <input
            type="text"
            id="estimatedDuration"
            name="estimatedDuration"
            value={formData.estimatedDuration}
            onChange={handleChange}
            placeholder="e.g., 2 weeks, 1 month"
            className="input-field text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional: How long do you think this will take?
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full text-sm disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-xs text-blue-700">
          💡 <strong>Tip:</strong> Personalize your cover letter to show you've read the job description carefully and explain how your skills match the requirements.
        </p>
      </div>
    </div>
  )
}