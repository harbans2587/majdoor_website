import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Navigation } from '@/components/Navigation'
import { JobDetails } from '@/components/JobDetails'
import { ApplicationForm } from '@/components/ApplicationForm'
import dbConnect from '@/lib/mongodb'
import { Job } from '@/models/Job'
import { EmployerProfile } from '@/models/User'

export default async function JobDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  try {
    await dbConnect()
    const job = await Job.findById(id)
      .populate('employerId', 'name')
      .lean()

    if (!job) {
      notFound()
    }

    // Get employer profile for additional info
    const employerProfile = await EmployerProfile.findOne({ userId: (job as any).employerId._id }).lean()

    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <JobDetails job={job} employerProfile={employerProfile} />
              </div>
              <div>
                {session && session.user.userType === 'worker' ? (
                  <ApplicationForm 
                    jobId={id} 
                    employerId={(job as any).employerId._id.toString()}
                  />
                ) : (
                  <div className="card">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Apply for this job
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Sign in as a worker to apply for this position.
                    </p>
                    <a href="/auth/signin" className="btn-primary w-full text-center">
                      Sign In
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  } catch (error) {
    console.error('Error loading job:', error)
    notFound()
  }
}