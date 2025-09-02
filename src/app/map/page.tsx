'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import InteractiveMap from '@/components/InteractiveMap';

interface Signup {
  id: string;
  name: string;
  email: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  timestamp: string;
}

export default function MapPage() {
  const [signups, setSignups] = useState<Signup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSignups();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchSignups, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchSignups = async () => {
    try {
      const response = await fetch('/api/signups', {
        cache: 'no-store', // Ensure fresh data
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSignups(data);
      }
    } catch (error) {
      console.error('Error fetching signups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    fetchSignups();
  };

  const validSignups = signups.filter(signup => 
    signup.coordinates && 
    signup.coordinates.lat !== 0 && 
    signup.coordinates.lng !== 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            CSGSA Student Origins Map
          </h1>
          <p className="text-xl text-blue-200 mb-6">
            Discover the global diversity of our Computer Science graduate students
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition duration-200"
            >
              Register for Welcome Event
            </Link>
            <Link 
              href="/"
              className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-6 py-2 rounded-md font-medium transition duration-200"
            >
              Back to Home
            </Link>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-md font-medium transition duration-200"
            >
              {isLoading ? 'Refreshing...' : 'Refresh Map'}
            </button>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Global Student Community
            </h2>
            <p className="text-gray-300">
              {isLoading 
                ? 'Loading...' 
                : `Showing ${validSignups.length} CS graduate student${validSignups.length !== 1 ? 's' : ''} on the map`
              }
            </p>
          </div>
          
          <InteractiveMap />
        </div>

        {!isLoading && signups.length > 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Recent Registrations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {signups
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 6)
                .map((signup) => (
                  <div key={signup.id} className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                    <h3 className="font-semibold text-white">{signup.name}</h3>
                    <p className="text-blue-200 text-sm">{signup.location}</p>
                    <p className="text-gray-400 text-xs mt-2">
                      Registered: {new Date(signup.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))}
            </div>
            
            {signups.length > 6 && (
              <div className="mt-4 text-center">
                <p className="text-gray-400">
                  And {signups.length - 6} more student{signups.length - 6 !== 1 ? 's' : ''} registered...
                </p>
              </div>
            )}
          </div>
        )}

        {!isLoading && signups.length === 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              No Registrations Yet
            </h2>
            <p className="text-gray-300 mb-6">
              Be the first CS graduate student to register for our welcome event!
            </p>
            <Link 
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition duration-200"
            >
              Register Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
