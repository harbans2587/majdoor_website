'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface WorkerProfileFormProps {
  userId: string
}

export function WorkerProfileForm({ userId }: WorkerProfileFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    bio: '',
    skills: '',
    hourlyRate: '',
    availability: 'full-time',
    location: {
      city: '',
      state: '',
      country: ''
    },
    experience: [
      {
        company: '',
        position: '',
        duration: '',
        description: ''
      }
    ],
    education: [
      {
        institution: '',
        degree: '',
        year: ''
      }
    ]
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/profile/worker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
          hourlyRate: parseFloat(formData.hourlyRate) || 0
        })
      })

      if (response.ok) {
        setMessage('Profile saved successfully!')
        setTimeout(() => router.push('/dashboard'), 2000)
      } else {
        const error = await response.json()
        setMessage(error.error || 'Failed to save profile')
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.includes('location.')) {
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

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const newExperience = [...formData.experience]
    newExperience[index] = {
      ...newExperience[index],
      [field]: value
    }
    setFormData({
      ...formData,
      experience: newExperience
    })
  }

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        { company: '', position: '', duration: '', description: '' }
      ]
    })
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div className={`p-4 rounded-md ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Professional Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Full Stack Developer"
                className="input-field mt-1"
              />
            </div>
            <div>
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
                Hourly Rate ($)
              </label>
              <input
                type="number"
                id="hourlyRate"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                placeholder="25"
                className="input-field mt-1"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Professional Bio *
          </label>
          <textarea
            id="bio"
            name="bio"
            required
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell employers about your background, experience, and what makes you unique..."
            className="input-field mt-1"
          />
        </div>

        {/* Skills */}
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
            Skills (comma-separated) *
          </label>
          <input
            type="text"
            id="skills"
            name="skills"
            required
            value={formData.skills}
            onChange={handleChange}
            placeholder="React, Node.js, Python, Project Management"
            className="input-field mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">
            Separate skills with commas
          </p>
        </div>

        {/* Availability */}
        <div>
          <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
            Availability
          </label>
          <select
            id="availability"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            className="input-field mt-1"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
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
                placeholder="New York"
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
                placeholder="NY"
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
        </div>

        {/* Experience */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
            <button
              type="button"
              onClick={addExperience}
              className="btn-secondary text-sm"
            >
              Add Experience
            </button>
          </div>
          {formData.experience.map((exp, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={exp.company}
                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={exp.position}
                  onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Duration (e.g., 2020-2022)"
                  value={exp.duration}
                  onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                  className="input-field"
                />
              </div>
              <textarea
                placeholder="Describe your responsibilities and achievements..."
                rows={3}
                value={exp.description}
                onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                className="input-field"
              />
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}