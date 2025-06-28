import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Connect Workers with <span className="text-yellow-300">Opportunities</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
            Majdoor is the platform where skilled workers meet employers. 
            Find your next job or hire the perfect worker for your project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/jobs" 
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Find Jobs
            </Link>
            <Link 
              href="/post-job" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}