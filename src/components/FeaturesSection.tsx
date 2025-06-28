export function FeaturesSection() {
  const features = [
    {
      icon: '👷',
      title: 'For Workers',
      description: 'Create your profile, showcase your skills, and find jobs that match your expertise.',
      benefits: ['Skill-based matching', 'Fair payment', 'Flexible work', 'Career growth']
    },
    {
      icon: '🏢',
      title: 'For Employers',
      description: 'Post jobs, find qualified workers, and manage your projects efficiently.',
      benefits: ['Quality workers', 'Easy hiring', 'Project management', 'Secure payments']
    },
    {
      icon: '⭐',
      title: 'Trust & Safety',
      description: 'Rating system, secure payments, and verified profiles ensure quality interactions.',
      benefits: ['User verification', 'Secure payments', 'Review system', '24/7 support']
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Majdoor Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connecting workers and employers through a simple, secure, and efficient platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {feature.description}
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                {feature.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center justify-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Ready to get started?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of workers and employers who trust Majdoor for their employment needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Sign Up as Worker
              </button>
              <button className="btn-secondary">
                Sign Up as Employer
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}