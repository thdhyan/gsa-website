import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-yellow-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-yellow-400 mb-4">
            🐿️ Welcome to CS GSA
          </h1>
          <h2 className="text-3xl font-semibold text-yellow-200 mb-6">
            Computer Science Graduate Students Association
          </h2>
          <p className="text-xl text-yellow-300 mb-8 max-w-4xl mx-auto">
            University of Minnesota - Twin Cities 🏛️
          </p>
          <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto">
            Join our community of graduate students in Computer Science! Sign up
            for our welcome event and connect with fellow Gophers from around
            the world. See where our diverse community comes from on our
            interactive map. 🌍
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link
              href="/signup"
              className="bg-yellow-600 hover:bg-yellow-700 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🎉 Register for Welcome Event
            </Link>
            <Link
              href="/map"
              className="bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm text-yellow-200 border-2 border-yellow-600/50 px-8 py-4 rounded-lg font-semibold text-lg transition duration-200 shadow-lg hover:shadow-xl"
            >
              🗺️ View Student Origins Map
            </Link>
          </div>

          {/* Tutorial Demo Section */}
          <div className="mb-16">
            <h3 className="text-lg font-semibold text-yellow-300 mb-4">
              📚 Database Tutorial Demo
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/comments"
                className="bg-red-800/50 hover:bg-red-700/50 backdrop-blur-sm text-yellow-200 border border-yellow-600/50 px-6 py-3 rounded-lg font-medium transition duration-200"
              >
                💬 Add Comment
              </Link>
              <Link
                href="/view-comments"
                className="bg-red-800/50 hover:bg-red-700/50 backdrop-blur-sm text-yellow-200 border border-yellow-600/50 px-6 py-3 rounded-lg font-medium transition duration-200"
              >
                👀 View Comments
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-900/80 backdrop-blur-md border border-yellow-600/30 rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-900/50 border border-yellow-600/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="text-xl font-semibold text-yellow-400 mb-2">
              Welcome Event Registration
            </h3>
            <p className="text-gray-300">
              Quick registration for CS graduate students. Join our welcome
              event and meet your fellow Gophers! 🐿️
            </p>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-md border border-yellow-600/30 rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-900/50 border border-yellow-600/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="text-xl font-semibold text-yellow-400 mb-2">
              Global Diversity Map
            </h3>
            <p className="text-gray-300">
              Discover the diverse backgrounds of our CS graduate student
              community worldwide. From Minnesota to Mumbai! 🗺️
            </p>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-md border border-yellow-600/30 rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-900/50 border border-yellow-600/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="text-xl font-semibold text-yellow-400 mb-2">
              Connect & Network
            </h3>
            <p className="text-gray-300">
              Build connections with fellow CS grad students from UMN and around
              the globe. Go Gophers! 🐿️
            </p>
          </div>
        </div>

        {/* CSGSA Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-gray-900/80 backdrop-blur-md border border-yellow-600/30 rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-yellow-400 mb-4">
              🏛️ About CS GSA
            </h3>
            <p className="text-gray-300 mb-4">
              The Computer Science Graduate Students Association represents and
              supports graduate students in the Department of Computer Science &
              Engineering at the University of Minnesota - Twin Cities. We&apos;re
              proud to be part of the Gopher community! 🐿️
            </p>
            <div className="flex justify-center">
              <a
                href="https://cse.umn.edu/cs/computer-science-graduate-students-association-csgsa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-yellow-400 hover:text-yellow-300 font-medium transition-colors duration-200"
              >
                🔗 Learn more about CS GSA
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
