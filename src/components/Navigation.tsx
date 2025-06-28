'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export function Navigation() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Majdoor
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/jobs" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
              Find Jobs
            </Link>
            <Link href="/post-job" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
              Post Job
            </Link>
            
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="btn-secondary"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin" className="btn-secondary">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link href="/jobs" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
                Find Jobs
              </Link>
              <Link href="/post-job" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
                Post Job
              </Link>
              
              {session ? (
                <>
                  <Link href="/dashboard" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
                    Profile
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
                    Sign In
                  </Link>
                  <Link href="/auth/signup" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}