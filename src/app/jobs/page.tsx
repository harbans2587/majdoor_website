import { Navigation } from '@/components/Navigation'
import { JobsListing } from '@/components/JobsListing'
import { JobFilters } from '@/components/JobFilters'

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Find Jobs</h1>
            <p className="text-gray-600">Discover opportunities that match your skills</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <JobFilters />
            </div>
            <div className="lg:col-span-3">
              <JobsListing />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}