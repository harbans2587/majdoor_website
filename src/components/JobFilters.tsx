'use client'

import { useState } from 'react'

interface Filters {
  jobType: string[]
  experienceLevel: string[]
  location: string
  budget: {
    min: string
    max: string
  }
  skills: string
}

export function JobFilters() {
  const [filters, setFilters] = useState<Filters>({
    jobType: [],
    experienceLevel: [],
    location: '',
    budget: {
      min: '',
      max: ''
    },
    skills: ''
  })

  const jobTypes = ['full-time', 'part-time', 'contract', 'freelance']
  const experienceLevels = ['entry', 'intermediate', 'senior']

  const handleFilterChange = (filterType: keyof Filters, value: any) => {
    setFilters({
      ...filters,
      [filterType]: value
    })
  }

  const handleArrayFilterChange = (filterType: 'jobType' | 'experienceLevel', value: string) => {
    const currentArray = filters[filterType]
    if (currentArray.includes(value)) {
      handleFilterChange(filterType, currentArray.filter(item => item !== value))
    } else {
      handleFilterChange(filterType, [...currentArray, value])
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
      
      {/* Job Type */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Job Type</h4>
        <div className="space-y-2">
          {jobTypes.map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.jobType.includes(type)}
                onChange={() => handleArrayFilterChange('jobType', type)}
                className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Experience Level</h4>
        <div className="space-y-2">
          {experienceLevels.map((level) => (
            <label key={level} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.experienceLevel.includes(level)}
                onChange={() => handleArrayFilterChange('experienceLevel', level)}
                className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 capitalize">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Location</h4>
        <input
          type="text"
          placeholder="Enter city or 'remote'"
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="input-field text-sm"
        />
      </div>

      {/* Budget Range */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Budget Range</h4>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.budget.min}
            onChange={(e) => handleFilterChange('budget', {
              ...filters.budget,
              min: e.target.value
            })}
            className="input-field text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.budget.max}
            onChange={(e) => handleFilterChange('budget', {
              ...filters.budget,
              max: e.target.value
            })}
            className="input-field text-sm"
          />
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Skills</h4>
        <input
          type="text"
          placeholder="e.g., React, Node.js"
          value={filters.skills}
          onChange={(e) => handleFilterChange('skills', e.target.value)}
          className="input-field text-sm"
        />
      </div>

      {/* Apply Filters Button */}
      <button className="btn-primary w-full text-sm">
        Apply Filters
      </button>
      
      {/* Clear Filters */}
      <button 
        onClick={() => setFilters({
          jobType: [],
          experienceLevel: [],
          location: '',
          budget: { min: '', max: '' },
          skills: ''
        })}
        className="btn-secondary w-full text-sm mt-2"
      >
        Clear All
      </button>
    </div>
  )
}