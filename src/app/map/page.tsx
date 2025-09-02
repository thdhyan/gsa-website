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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Global Community
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            See where our members are located around the world
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/signup"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium transition duration-200"
            >
              Join the Community
            </Link>
            <Link 
              href="/"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium transition duration-200"
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

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Community Map
            </h2>
            <p className="text-gray-600">
              {isLoading 
                ? 'Loading...' 
                : `Showing ${validSignups.length} member${validSignups.length !== 1 ? 's' : ''} on the map`
              }
            </p>
          </div>
          
          <InteractiveMap />
        </div>

        {!isLoading && signups.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Recent Members
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {signups
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 6)
                .map((signup) => (
                  <div key={signup.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">{signup.name}</h3>
                    <p className="text-gray-600 text-sm">{signup.location}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      Joined: {new Date(signup.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))}
            </div>
            
            {signups.length > 6 && (
              <div className="mt-4 text-center">
                <p className="text-gray-600">
                  And {signups.length - 6} more member{signups.length - 6 !== 1 ? 's' : ''}...
                </p>
              </div>
            )}
          </div>
        )}

        {!isLoading && signups.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              No Members Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Be the first to join our community!
            </p>
            <Link 
              href="/signup"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium transition duration-200"
            >
              Sign Up Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
