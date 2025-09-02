'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    mediaConsent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/signups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Signup successful! Redirecting to map...');
        setFormData({ name: '', email: '', location: '', mediaConsent: false });
        
        // Redirect to map page after 2 seconds
        setTimeout(() => {
          router.push('/map');
        }, 2000);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              CSGSA Welcome Event
            </h1>
            <p className="text-blue-200 mb-2">
              Computer Science Graduate Students Association
            </p>
            <p className="text-gray-400">
              Register for our welcome event and join the community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                Where are you from?
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Mumbai, London, Minneapolis"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your city, state, or country of origin
              </p>
            </div>

            <div className="border-t border-gray-600 pt-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="mediaConsent"
                  name="mediaConsent"
                  checked={formData.mediaConsent}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  disabled={isSubmitting}
                />
                <div>
                  <label htmlFor="mediaConsent" className="text-sm font-medium text-gray-300">
                    Media Release Consent
                  </label>
                  <p className="text-xs text-gray-400 mt-1">
                    I consent to being photographed, recorded, or otherwise captured in media during CSGSA events. 
                    I understand that these images/videos may be used for promotional purposes, social media, 
                    newsletters, and other CSGSA communications. This consent is voluntary and can be withdrawn at any time.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {isSubmitting ? 'Registering...' : 'Register for Welcome Event'}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-md ${
              message.includes('Error') 
                ? 'bg-red-900 border border-red-700 text-red-200' 
                : 'bg-green-900 border border-green-700 text-green-200'
            }`}>
              {message}
            </div>
          )}

          <div className="mt-6 text-center">
            <Link 
              href="/map" 
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition duration-200"
            >
              View Student Origins Map →
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link 
              href="/" 
              className="text-gray-500 hover:text-gray-400 text-sm transition duration-200"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
