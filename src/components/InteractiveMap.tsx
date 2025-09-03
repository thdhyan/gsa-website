"use client";

import React from "react";
import dynamic from "next/dynamic";

// Define the Signup interface
interface Signup {
  id: string | number;
  name: string;
  email: string;
  location: string;
  latitude?: number;
  longitude?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  timestamp?: string;
  created_at?: string;
  mediaConsent?: boolean;
}

export interface InteractiveMapProps {
  signups: Signup[];
  className?: string;
}

// Dynamic import for the map component to handle SSR
const MapComponent = dynamic(
  () => import("react-leaflet").then((mod) => {
    const { MapContainer, TileLayer, Marker, Popup } = mod;
    
    return function MapComponentInner({ signups }: { signups: Signup[] }) {
      console.log('MapComponentInner received signups:', signups);
      
      // Transform coordinates to ensure consistent format
      const processedSignups = signups.map(signup => {
        let lat, lng;
        
        if (signup.coordinates) {
          lat = signup.coordinates.lat;
          lng = signup.coordinates.lng;
        } else if (signup.latitude !== undefined && signup.longitude !== undefined) {
          lat = signup.latitude;
          lng = signup.longitude;
        } else {
          console.log('No coordinates found for signup:', signup);
          return null;
        }
        
        return {
          ...signup,
          lat,
          lng
        };
      }).filter(Boolean) as (Signup & { lat: number; lng: number })[];

      console.log('Processed signups for map:', processedSignups);

      if (processedSignups.length === 0) {
        return (
          <MapContainer
            center={[39.8283, -98.5795]} // Center of US
            zoom={4}
            style={{ height: "600px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </MapContainer>
        );
      }

      // Calculate bounds for all markers
      const bounds = processedSignups.map(signup => [signup.lat, signup.lng] as [number, number]);
      
      return (
        <MapContainer
          bounds={bounds}
          style={{ height: "600px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {processedSignups.map((signup) => (
            <Marker key={signup.id} position={[signup.lat, signup.lng]}>
              <Popup>
                <div>
                  <h3 className="font-semibold">{signup.name}</h3>
                  <p className="text-sm">{signup.location}</p>
                  {(signup.timestamp || signup.created_at) && (
                    <p className="text-xs text-gray-600">
                      {new Date(signup.timestamp || signup.created_at!).toLocaleDateString()}
                    </p>
                  )}
                  {signup.mediaConsent !== undefined && (
                    <p className="text-xs text-blue-600">
                      Media consent: {signup.mediaConsent ? 'Yes' : 'No'}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      );
    };
  }),
  {
    ssr: false,
    loading: () => (
      <div 
        style={{ height: "600px", width: "100%" }} 
        className="bg-gray-100 flex items-center justify-center"
      >
        <p>Loading map...</p>
      </div>
    ),
  }
);

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  signups,
  className = "",
}) => {
  // Configure Leaflet default icons to use local files
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        // Fix default markers for production
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: '/marker-icon-2x.png',
          iconUrl: '/marker-icon.png',
          shadowUrl: '/marker-shadow.png',
        });
      });
    }
  }, []);

  return (
    <div className={`w-full h-[600px] rounded-lg overflow-hidden ${className}`}>
      <MapComponent signups={signups} />
    </div>
  );
};

export default InteractiveMap;
