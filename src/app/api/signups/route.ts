import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export interface Signup {
  id: string;
  name: string;
  email: string;
  location: string;
  mediaConsent?: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
  timestamp: string;
}

// In-memory storage for serverless environments (fallback)
const inMemorySignups: Signup[] = [
  {
    "id": "1725321600000",
    "name": "John Doe",
    "email": "john@example.com",
    "location": "New York",
    "mediaConsent": true,
    "coordinates": {
      "lat": 40.7128,
      "lng": -74.006
    },
    "timestamp": "2024-09-02T16:00:00.000Z"
  },
  {
    "id": "1725325200000",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "location": "London",
    "mediaConsent": false,
    "coordinates": {
      "lat": 51.5074,
      "lng": -0.1278
    },
    "timestamp": "2024-09-02T17:00:00.000Z"
  },
  {
    "id": "1725328800000",
    "name": "Akira Tanaka",
    "email": "akira@example.com",
    "location": "Tokyo",
    "mediaConsent": true,
    "coordinates": {
      "lat": 35.6762,
      "lng": 139.6503
    },
    "timestamp": "2024-09-02T18:00:00.000Z"
  }
];

// Get signups from database or memory fallback
async function getSignups(): Promise<Signup[]> {
  try {
    // Initialize Neon database connection
    const sql = neon(process.env.DATABASE_URL!);
    
    const rows = await sql`
      SELECT id, name, email, location, media_consent, lat, lng, timestamp 
      FROM signups 
      ORDER BY timestamp DESC
    `;
    
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      location: row.location,
      mediaConsent: row.media_consent,
      coordinates: row.lat && row.lng ? { lat: Number(row.lat), lng: Number(row.lng) } : undefined,
      timestamp: row.timestamp
    }));
  } catch (error) {
    console.log('Database not available, using in-memory storage:', error);
    // Fallback to in-memory storage
    return inMemorySignups;
  }
}

// Save signups to database or memory fallback
async function saveSignup(signup: Signup): Promise<void> {
  try {
    // Initialize Neon database connection
    const sql = neon(process.env.DATABASE_URL!);
    
    await sql`
      INSERT INTO signups (id, name, email, location, media_consent, lat, lng, timestamp)
      VALUES (${signup.id}, ${signup.name}, ${signup.email}, ${signup.location}, 
              ${signup.mediaConsent || false}, ${signup.coordinates?.lat || null}, ${signup.coordinates?.lng || null}, ${signup.timestamp})
    `;
  } catch (error) {
    console.log('Database not available, using in-memory storage:', error);
    // Fallback to in-memory storage
    inMemorySignups.push(signup);
  }
}

// Simple geocoding function (you can replace with a real geocoding service)
async function geocodeLocation(location: string): Promise<{ lat: number; lng: number } | null> {
  // This is a simple mock geocoding - in production, use Google Maps API or similar
  const mockCoordinates: { [key: string]: { lat: number; lng: number } } = {
    // Major cities
    'new york': { lat: 40.7128, lng: -74.0060 },
    'london': { lat: 51.5074, lng: -0.1278 },
    'tokyo': { lat: 35.6762, lng: 139.6503 },
    'paris': { lat: 48.8566, lng: 2.3522 },
    'sydney': { lat: -33.8688, lng: 151.2093 },
    'berlin': { lat: 52.5200, lng: 13.4050 },
    'moscow': { lat: 55.7558, lng: 37.6176 },
    'beijing': { lat: 39.9042, lng: 116.4074 },
    'mumbai': { lat: 19.0760, lng: 72.8777 },
    'cairo': { lat: 30.0444, lng: 31.2357 },
    'dubai': { lat: 25.2048, lng: 55.2708 },
    'singapore': { lat: 1.3521, lng: 103.8198 },
    'hong kong': { lat: 22.3193, lng: 114.1694 },
    'seoul': { lat: 37.5665, lng: 126.9780 },
    'mexico city': { lat: 19.4326, lng: -99.1332 },
    'buenos aires': { lat: -34.6118, lng: -58.3960 },
    'lagos': { lat: 6.5244, lng: 3.3792 },
    'johannesburg': { lat: -26.2041, lng: 28.0473 },
    'istanbul': { lat: 41.0082, lng: 28.9784 },
    'bangkok': { lat: 13.7563, lng: 100.5018 },
    'jakarta': { lat: -6.2088, lng: 106.8456 },
    'manila': { lat: 14.5995, lng: 120.9842 },
    'kuala lumpur': { lat: 3.1390, lng: 101.6869 },
    'tehran': { lat: 35.6892, lng: 51.3890 },
    'karachi': { lat: 24.8607, lng: 67.0011 },
    'lahore': { lat: 31.5497, lng: 74.3436 },
    'dhaka': { lat: 23.8103, lng: 90.4125 },
    'kolkata': { lat: 22.5726, lng: 88.3639 },
    'chennai': { lat: 13.0827, lng: 80.2707 },
    'bangalore': { lat: 12.9716, lng: 77.5946 },
    'hyderabad': { lat: 17.3850, lng: 78.4867 },
    'pune': { lat: 18.5204, lng: 73.8567 },
    'ahmedabad': { lat: 23.0225, lng: 72.5714 },
    'surat': { lat: 21.1702, lng: 72.8311 },
    'jaipur': { lat: 26.9124, lng: 75.7873 },
    'lucknow': { lat: 26.8467, lng: 80.9462 },
    'kanpur': { lat: 26.4499, lng: 80.3319 },
    'nagpur': { lat: 21.1458, lng: 79.0882 },
    'indore': { lat: 22.7196, lng: 75.8577 },
    'thane': { lat: 19.2183, lng: 72.9781 },
    'bhopal': { lat: 23.2599, lng: 77.4126 },
    'visakhapatnam': { lat: 17.6868, lng: 83.2185 },
    'patna': { lat: 25.5941, lng: 85.1376 },
    
    // US Cities
    'minneapolis': { lat: 44.9778, lng: -93.2650 },
    'saint paul': { lat: 44.9537, lng: -93.0900 },
    'chicago': { lat: 41.8781, lng: -87.6298 },
    'los angeles': { lat: 34.0522, lng: -118.2437 },
    'san francisco': { lat: 37.7749, lng: -122.4194 },
    'boston': { lat: 42.3601, lng: -71.0589 },
    'washington dc': { lat: 38.9072, lng: -77.0369 },
    'seattle': { lat: 47.6062, lng: -122.3321 },
    'denver': { lat: 39.7392, lng: -104.9903 },
    'atlanta': { lat: 33.7490, lng: -84.3880 },
    
    // States/Regions/Countries
    'california': { lat: 36.7783, lng: -119.4179 },
    'florida': { lat: 27.7663, lng: -82.6404 },
    'texas': { lat: 31.9686, lng: -99.9018 },
    'new york state': { lat: 42.1657, lng: -74.9481 },
    'canada': { lat: 56.1304, lng: -106.3468 },
    'brazil': { lat: -14.2350, lng: -51.9253 },
    'india': { lat: 20.5937, lng: 78.9629 },
    'china': { lat: 35.8617, lng: 104.1954 },
    'germany': { lat: 51.1657, lng: 10.4515 },
    'france': { lat: 46.6034, lng: 1.8883 },
    'italy': { lat: 41.8719, lng: 12.5674 },
    'spain': { lat: 40.4637, lng: -3.7492 },
    'united kingdom': { lat: 55.3781, lng: -3.4360 },
    'uk': { lat: 55.3781, lng: -3.4360 },
    'australia': { lat: -25.2744, lng: 133.7751 },
    'japan': { lat: 36.2048, lng: 138.2529 },
    'south korea': { lat: 35.9078, lng: 127.7669 },
    'russia': { lat: 61.5240, lng: 105.3188 },
    'mexico': { lat: 23.6345, lng: -102.5528 },
    'argentina': { lat: -38.4161, lng: -63.6167 },
    'south africa': { lat: -30.5595, lng: 22.9375 },
    'egypt': { lat: 26.8206, lng: 30.8025 },
    'turkey': { lat: 38.9637, lng: 35.2433 },
    'iran': { lat: 32.4279, lng: 53.6880 },
    'pakistan': { lat: 30.3753, lng: 69.3451 },
    'bangladesh': { lat: 23.6850, lng: 90.3563 },
    'thailand': { lat: 15.8700, lng: 100.9925 },
    'indonesia': { lat: -0.7893, lng: 113.9213 },
    'philippines': { lat: 12.8797, lng: 121.7740 },
    'malaysia': { lat: 4.2105, lng: 101.9758 },
    'vietnam': { lat: 14.0583, lng: 108.2772 },
    'nepal': { lat: 28.3949, lng: 84.1240 },
    'sri lanka': { lat: 7.8731, lng: 80.7718 },
    'myanmar': { lat: 21.9162, lng: 95.9560 },
    'cambodia': { lat: 12.5657, lng: 104.9910 },
    'laos': { lat: 19.8563, lng: 102.4955 },
    'mongolia': { lat: 46.8625, lng: 103.8467 },
    'north korea': { lat: 40.3399, lng: 127.5101 },
    'afghanistan': { lat: 33.9391, lng: 67.7100 },
    'saudi arabia': { lat: 23.8859, lng: 45.0792 },
    'uae': { lat: 23.4241, lng: 53.8478 },
    'israel': { lat: 31.0461, lng: 34.8516 },
    'lebanon': { lat: 33.8547, lng: 35.8623 },
    'jordan': { lat: 30.5852, lng: 36.2384 },
    'iraq': { lat: 33.2232, lng: 43.6793 },
    'syria': { lat: 34.8021, lng: 38.9968 },
    'yemen': { lat: 15.5527, lng: 48.5164 },
    'oman': { lat: 21.4735, lng: 55.9754 },
    'qatar': { lat: 25.3548, lng: 51.1839 },
    'kuwait': { lat: 29.3117, lng: 47.4818 },
    'bahrain': { lat: 25.9304, lng: 50.6378 },
  };
  
  const normalized = location.toLowerCase().trim();
  
  // Try exact match first
  if (mockCoordinates[normalized]) {
    return mockCoordinates[normalized];
  }
  
  // Try partial matches for cities with country/state
  for (const [key, coords] of Object.entries(mockCoordinates)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }
  
  // Default to center of map if no match found
  return { lat: 20, lng: 0 };
}

export async function GET() {
  try {
    const signups = await getSignups();
    return NextResponse.json(signups);
  } catch (error) {
    console.error('Error fetching signups:', error);
    return NextResponse.json({ error: 'Failed to fetch signups' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, location, mediaConsent } = body;

    if (!name || !email || !location) {
      return NextResponse.json(
        { error: 'Name, email, and location are required' },
        { status: 400 }
      );
    }
    
    // Get coordinates for the location
    const coordinates = await geocodeLocation(location);
    
    const newSignup: Signup = {
      id: Date.now().toString(),
      name,
      email,
      location,
      mediaConsent: mediaConsent || false,
      coordinates: coordinates || undefined,
      timestamp: new Date().toISOString(),
    };

    await saveSignup(newSignup);

    return NextResponse.json(newSignup, { status: 201 });
  } catch (error) {
    console.error('Error creating signup:', error);
    return NextResponse.json({ error: 'Failed to create signup' }, { status: 500 });
  }
}
