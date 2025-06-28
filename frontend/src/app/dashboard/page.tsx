'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, logout } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store/store';
import Link from 'next/link';
import {
  BriefcaseIcon,
  UserGroupIcon,
  DocumentTextIcon,
  StarIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/login');
    } else if (isAuthenticated && !user) {
      dispatch(loadUser());
    }
  }, [isAuthenticated, isLoading, user, router, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const isWorker = user.role === 'worker';
  const isEmployer = user.role === 'employer';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                Majdoor
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <BellIcon className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                </div>
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            {isWorker 
              ? "Find new opportunities and manage your applications" 
              : "Post jobs and find the perfect workers for your projects"}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <BriefcaseIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {isWorker ? 'Applications' : 'Active Jobs'}
                </p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {isWorker ? 'Interviews' : 'Applications'}
                </p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <StarIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user.averageRating > 0 ? user.averageRating.toFixed(1) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{user.totalReviews}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-4">
              {isWorker ? (
                <>
                  <Link href="/jobs" className="flex items-center p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <BriefcaseIcon className="h-8 w-8 text-primary-600" />
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">Browse Jobs</h3>
                      <p className="text-sm text-gray-600">Find new job opportunities</p>
                    </div>
                  </Link>
                  <Link href="/profile" className="flex items-center p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <UserGroupIcon className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">Update Profile</h3>
                      <p className="text-sm text-gray-600">Keep your profile current</p>
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/post-job" className="flex items-center p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <BriefcaseIcon className="h-8 w-8 text-primary-600" />
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">Post a Job</h3>
                      <p className="text-sm text-gray-600">Find workers for your project</p>
                    </div>
                  </Link>
                  <Link href="/workers" className="flex items-center p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <UserGroupIcon className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">Browse Workers</h3>
                      <p className="text-sm text-gray-600">Find skilled professionals</p>
                    </div>
                  </Link>
                </>
              )}
              <Link href="/settings" className="flex items-center p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                <Cog6ToothIcon className="h-8 w-8 text-gray-600" />
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Settings</h3>
                  <p className="text-sm text-gray-600">Manage your account</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="text-center py-8">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
              <p className="text-gray-600">
                {isWorker 
                  ? "Start by browsing available jobs or updating your profile"
                  : "Post your first job to get started"}
              </p>
            </div>
          </div>
        </div>

        {/* Account Verification Notice */}
        {!user.isVerified && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <BellIcon className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Account Verification Required
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Please verify your email address to access all features and improve your credibility.
                  </p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <button className="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600">
                      Resend verification email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}