import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to CSGSA
          </h1>
          <h2 className="text-3xl font-semibold text-blue-200 mb-6">
            Computer Science Graduate Students Association
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
            University of Minnesota - Twin Cities
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
            Join our community of graduate students in Computer Science! Sign up for our welcome event 
            and connect with fellow students from around the world. See where our diverse community 
            comes from on our interactive map.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link 
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition duration-200 shadow-lg hover:shadow-xl border border-blue-500"
            >
              Register for Welcome Event
            </Link>
            <Link 
              href="/map"
              className="bg-gray-800 hover:bg-gray-700 text-blue-200 border-2 border-blue-400 px-8 py-4 rounded-lg font-semibold text-lg transition duration-200 shadow-lg hover:shadow-xl"
            >
              View Student Origins Map
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Welcome Event Registration</h3>
            <p className="text-gray-300">
              Quick registration for CS graduate students. Join our welcome event and meet your peers.
            </p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Global Diversity Map</h3>
            <p className="text-gray-300">
              Discover the diverse backgrounds of our CS graduate student community worldwide.
            </p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Connect & Network</h3>
            <p className="text-gray-300">
              Build connections with fellow CS grad students from UMN and around the globe.
            </p>
          </div>
        </div>

        {/* CSGSA Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-white mb-4">About CSGSA</h3>
            <p className="text-gray-300 mb-4">
              The Computer Science Graduate Students Association represents and supports graduate students 
              in the Department of Computer Science & Engineering at the University of Minnesota.
            </p>
            <div className="flex justify-center">
              <a 
                href="https://cse.umn.edu/cs/computer-science-graduate-students-association-csgsa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium"
              >
                Learn more about CSGSA
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
