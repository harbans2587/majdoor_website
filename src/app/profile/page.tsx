import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Navigation } from '@/components/Navigation'
import { WorkerProfileForm } from '@/components/profile/WorkerProfileForm'
import { EmployerProfileForm } from '@/components/profile/EmployerProfileForm'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {session.user.profileComplete ? 'Edit Profile' : 'Complete Your Profile'}
            </h1>
            <p className="text-gray-600">
              {session.user.userType === 'worker' 
                ? 'Showcase your skills and experience to attract employers'
                : 'Tell potential workers about your company and projects'
              }
            </p>
          </div>

          {session.user.userType === 'worker' ? (
            <WorkerProfileForm userId={session.user.id} />
          ) : (
            <EmployerProfileForm userId={session.user.id} />
          )}
        </div>
      </main>
    </div>
  )
}