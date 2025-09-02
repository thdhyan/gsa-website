'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

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

// Create a separate map component to handle Leaflet
function MapComponent({ signups }: { signups: Signup[] }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      // Import Leaflet dynamically when component mounts
      import('leaflet').then((L) => {
        // Fix default markers - properly typed interface
        interface LeafletIconPrototype {
          _getIconUrl?: () => string;
        }
        delete (L.Icon.Default.prototype as LeafletIconPrototype)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
      });
    }
  }, [isClient]);

  if (!isClient) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
  const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
  const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
  const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

  const validSignups = signups.filter(signup => 
    signup.coordinates && 
    (signup.coordinates.lat !== 0 || signup.coordinates.lng !== 0)
  );

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validSignups.map((signup) => (
          <Marker 
            key={signup.id} 
            position={[signup.coordinates!.lat, signup.coordinates!.lng]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-sm">{signup.name}</h3>
                <p className="text-xs text-gray-600">{signup.location}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Joined: {new Date(signup.timestamp).toLocaleDateString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default function InteractiveMap() {
  const [signups, setSignups] = useState<Signup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSignups();
    
    // Set up auto-refresh every 15 seconds for the map component
    const interval = setInterval(fetchSignups, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchSignups = async () => {
    try {
      const response = await fetch('/api/signups', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSignups(data);
      } else {
        setError('Failed to load signups');
      }
    } catch (err) {
      setError('An error occurred while loading signups');
      console.error('Error fetching signups:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return <MapComponent signups={signups} />;
}
