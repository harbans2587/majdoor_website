import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Navigation } from '@/components/Navigation'
import { DashboardStats } from '@/components/DashboardStats'
import { RecentJobs } from '@/components/RecentJobs'
import { ProfileCompletionCard } from '@/components/ProfileCompletionCard'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {session.user.name}!
            </h1>
            <p className="text-gray-600">
              {session.user.userType === 'worker' 
                ? 'Find your next opportunity' 
                : 'Manage your job postings and find talent'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <DashboardStats userType={session.user.userType} />
            </div>
            <div>
              {!session.user.profileComplete && (
                <ProfileCompletionCard userType={session.user.userType} />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentJobs userType={session.user.userType} />
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {session.user.userType === 'worker' ? 'Recent Applications' : 'Recent Candidates'}
              </h3>
              <p className="text-gray-500 text-center py-8">
                No recent activity to show
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}