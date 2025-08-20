import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Agents of Faith</h1>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm text-gray-600">Theological AI Assistant</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Deep Theological
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Insights
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Ask questions about Scripture, theology, and Christian doctrine. 
                Get comprehensive answers grounded in biblical truth and historical context.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/ask" 
                  className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Start Asking Questions
                </Link>
                <button className="btn-outline text-lg px-8 py-4">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                What You Can Ask
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore the depths of theological understanding with our comprehensive AI assistant
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <div className="card hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Biblical Interpretation</h3>
                <p className="text-gray-600">Understand Scripture in its historical and theological context</p>
              </div>

              <div className="card hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Doctrinal Questions</h3>
                <p className="text-gray-600">Explore Christian beliefs across different traditions</p>
              </div>

              <div className="card hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Word Studies</h3>
                <p className="text-gray-600">Dive deep into Hebrew and Greek meanings</p>
              </div>

              <div className="card hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Historical Context</h3>
                <p className="text-gray-600">Learn about the cultural and historical background</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-white/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              About This Assistant
            </h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="mb-6">
                This AI assistant is trained on extensive theological resources and Scripture, 
                providing accurate, nuanced responses that respect the diversity of Christian 
                traditions while maintaining biblical fidelity.
              </p>
              <p>
                All responses follow a structured format with biblical citations, historical context, 
                theological implications, practical application, and suggestions for further study.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="card bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Explore Theology?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Start your journey of theological discovery today
              </p>
              <Link 
                href="/ask" 
                className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              >
                Begin Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold">Agents of Faith</span>
            </div>
            <p className="text-gray-400">
              Theological AI Assistant • © 2024 Agents of Faith
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
