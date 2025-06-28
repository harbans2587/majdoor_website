'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function JobPostingForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    skillsRequired: '',
    jobType: 'full-time',
    experienceLevel: 'intermediate',
    budget: {
      type: 'hourly',
      min: '',
      max: ''
    },
    location: {
      type: 'remote',
      city: '',
      state: '',
      country: ''
    },
    duration: '',
    deadline: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          requirements: formData.requirements.split('\n').filter(r => r.trim()),
          skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()).filter(s => s),
          budget: {
            ...formData.budget,
            min: parseFloat(formData.budget.min) || 0,
            max: formData.budget.max ? parseFloat(formData.budget.max) : undefined
          }
        })
      })

      if (response.ok) {
        setMessage('Job posted successfully!')
        setTimeout(() => router.push('/dashboard'), 2000)
      } else {
        const error = await response.json()
        setMessage(error.error || 'Failed to post job')
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.includes('budget.')) {
      const budgetField = name.split('.')[1]
      setFormData({
        ...formData,
        budget: {
          ...formData.budget,
          [budgetField]: value
        }
      })
    } else if (name.includes('location.')) {
      const locationField = name.split('.')[1]
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div className={`p-4 rounded-md ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* Job Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Job Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Senior React Developer"
            className="input-field mt-1"
          />
        </div>

        {/* Job Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Job Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={6}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the role, responsibilities, and what you're looking for..."
            className="input-field mt-1"
          />
        </div>

        {/* Requirements */}
        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
            Requirements
          </label>
          <textarea
            id="requirements"
            name="requirements"
            rows={4}
            value={formData.requirements}
            onChange={handleChange}
            placeholder="List key requirements (one per line)&#10;• 3+ years experience with React&#10;• Strong TypeScript skills&#10;• Experience with Node.js"
            className="input-field mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter each requirement on a new line
          </p>
        </div>

        {/* Skills Required */}
        <div>
          <label htmlFor="skillsRequired" className="block text-sm font-medium text-gray-700">
            Skills Required *
          </label>
          <input
            type="text"
            id="skillsRequired"
            name="skillsRequired"
            required
            value={formData.skillsRequired}
            onChange={handleChange}
            placeholder="React, TypeScript, Node.js, MongoDB"
            className="input-field mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">
            Separate skills with commas
          </p>
        </div>

        {/* Job Type and Experience Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
              Job Type *
            </label>
            <select
              id="jobType"
              name="jobType"
              required
              value={formData.jobType}
              onChange={handleChange}
              className="input-field mt-1"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
          <div>
            <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">
              Experience Level *
            </label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              required
              value={formData.experienceLevel}
              onChange={handleChange}
              className="input-field mt-1"
            >
              <option value="entry">Entry Level</option>
              <option value="intermediate">Intermediate</option>
              <option value="senior">Senior</option>
            </select>
          </div>
        </div>

        {/* Budget */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Budget</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="budget.type" className="block text-sm font-medium text-gray-700">
                Budget Type *
              </label>
              <select
                id="budget.type"
                name="budget.type"
                value={formData.budget.type}
                onChange={handleChange}
                className="input-field mt-1"
              >
                <option value="hourly">Hourly Rate</option>
                <option value="fixed">Fixed Price</option>
              </select>
            </div>
            <div>
              <label htmlFor="budget.min" className="block text-sm font-medium text-gray-700">
                Minimum ($) *
              </label>
              <input
                type="number"
                id="budget.min"
                name="budget.min"
                required
                value={formData.budget.min}
                onChange={handleChange}
                placeholder="25"
                className="input-field mt-1"
              />
            </div>
            <div>
              <label htmlFor="budget.max" className="block text-sm font-medium text-gray-700">
                Maximum ($)
              </label>
              <input
                type="number"
                id="budget.max"
                name="budget.max"
                value={formData.budget.max}
                onChange={handleChange}
                placeholder="50"
                className="input-field mt-1"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label htmlFor="location.type" className="block text-sm font-medium text-gray-700">
                Work Type *
              </label>
              <select
                id="location.type"
                name="location.type"
                value={formData.location.type}
                onChange={handleChange}
                className="input-field mt-1"
              >
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>
          
          {formData.location.type !== 'remote' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="location.city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="location.city"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  placeholder="San Francisco"
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label htmlFor="location.state" className="block text-sm font-medium text-gray-700">
                  State/Province
                </label>
                <input
                  type="text"
                  id="location.state"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  placeholder="CA"
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label htmlFor="location.country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  id="location.country"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleChange}
                  placeholder="United States"
                  className="input-field mt-1"
                />
              </div>
            </div>
          )}
        </div>

        {/* Duration and Deadline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Project Duration
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 3 months, 1 year"
              className="input-field mt-1"
            />
          </div>
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
              Application Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="input-field mt-1"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Posting Job...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  )
}