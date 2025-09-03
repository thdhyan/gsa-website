// Shared geocoding utilities for OpenCage Data API

// Define the OpenCage Data response types
interface OpenCageGeometry {
  lat: number;
  lng: number;
}

interface OpenCageResult {
  geometry: OpenCageGeometry;
  formatted: string;
  components: {
    [key: string]: string;
  };
}

interface OpenCageResponse {
  results: OpenCageResult[];
  status: {
    code: number;
    message: string;
  };
}

// Enhanced mock coordinate function with better geographic coverage
function getMockCoordinatesForAddress(address: string): { lat: number; lng: number } {
  const lowerAddress = address.toLowerCase();
  
  // US States and major cities
  if (lowerAddress.includes('texas') || lowerAddress.includes('austin')) {
    return { lat: 30.2672, lng: -97.7431 }; // Austin, Texas
  }
  if (lowerAddress.includes('california') || lowerAddress.includes('los angeles')) {
    return { lat: 34.0522, lng: -118.2437 };
  }
  if (lowerAddress.includes('new york') || lowerAddress.includes('nyc')) {
    return { lat: 40.7128, lng: -74.0060 };
  }
  if (lowerAddress.includes('florida') || lowerAddress.includes('miami')) {
    return { lat: 25.7617, lng: -80.1918 };
  }
  if (lowerAddress.includes('illinois') || lowerAddress.includes('chicago')) {
    return { lat: 41.8781, lng: -87.6298 };
  }
  if (lowerAddress.includes('minnesota') || lowerAddress.includes('minneapolis')) {
    return { lat: 44.9778, lng: -93.2650 };
  }
  
  // Indian states and cities
  if (lowerAddress.includes('bihar')) {
    return { lat: 25.0961, lng: 85.3131 }; // Patna, Bihar
  }
  if (lowerAddress.includes('mumbai') || lowerAddress.includes('bombay')) {
    return { lat: 19.0760, lng: 72.8777 };
  }
  if (lowerAddress.includes('delhi')) {
    return { lat: 28.7041, lng: 77.1025 };
  }
  if (lowerAddress.includes('bangalore') || lowerAddress.includes('bengaluru')) {
    return { lat: 12.9716, lng: 77.5946 };
  }
  if (lowerAddress.includes('hyderabad')) {
    return { lat: 17.3850, lng: 78.4867 };
  }
  if (lowerAddress.includes('chennai') || lowerAddress.includes('madras')) {
    return { lat: 13.0827, lng: 80.2707 };
  }
  if (lowerAddress.includes('kolkata') || lowerAddress.includes('calcutta')) {
    return { lat: 22.5726, lng: 88.3639 };
  }
  if (lowerAddress.includes('ahmedabad')) {
    return { lat: 23.0225, lng: 72.5714 };
  }
  if (lowerAddress.includes('pune')) {
    return { lat: 18.5204, lng: 73.8567 };
  }
  if (lowerAddress.includes('jaipur')) {
    return { lat: 26.9124, lng: 75.7873 };
  }
  
  // Countries
  if (lowerAddress.includes('india') && !lowerAddress.includes('indiana')) {
    return { lat: 20.5937, lng: 78.9629 }; // Center of India
  }
  if (lowerAddress.includes('united kingdom') || lowerAddress.includes('uk') || lowerAddress.includes('england')) {
    return { lat: 51.5074, lng: -0.1278 }; // London
  }
  if (lowerAddress.includes('canada')) {
    return { lat: 43.6532, lng: -79.3832 }; // Toronto
  }
  if (lowerAddress.includes('germany')) {
    return { lat: 52.5200, lng: 13.4050 }; // Berlin
  }
  if (lowerAddress.includes('france')) {
    return { lat: 48.8566, lng: 2.3522 }; // Paris
  }
  if (lowerAddress.includes('japan')) {
    return { lat: 35.6762, lng: 139.6503 }; // Tokyo
  }
  if (lowerAddress.includes('china')) {
    return { lat: 39.9042, lng: 116.4074 }; // Beijing
  }
  if (lowerAddress.includes('australia')) {
    return { lat: -33.8688, lng: 151.2093 }; // Sydney
  }
  
  // European cities
  if (lowerAddress.includes('london')) {
    return { lat: 51.5074, lng: -0.1278 };
  }
  if (lowerAddress.includes('paris')) {
    return { lat: 48.8566, lng: 2.3522 };
  }
  if (lowerAddress.includes('berlin')) {
    return { lat: 52.5200, lng: 13.4050 };
  }
  if (lowerAddress.includes('madrid')) {
    return { lat: 40.4168, lng: -3.7038 };
  }
  if (lowerAddress.includes('rome')) {
    return { lat: 41.9028, lng: 12.4964 };
  }
  
  // Default to Minneapolis (since this is a University of Minnesota project)
  return { lat: 44.9778, lng: -93.2650 };
}

// Get coordinates from any text address using OpenCage Data Geocoding API
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const apiKey = process.env.OPENCAGE_API_KEY;

  if (!apiKey) {
    // Return mock coordinates for development/demo based on common patterns
    console.log(`🔧 No OpenCage API key, using mock coordinates for: ${address}`);
    return getMockCoordinatesForAddress(address);
  }

  try {
    // Use OpenCage Data Geocoding API to convert any address to coordinates
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}&limit=1&no_annotations=1`
    );

    const data: OpenCageResponse = await response.json();

    if (
      !response.ok ||
      data.status.code !== 200 ||
      !data.results ||
      data.results.length === 0
    ) {
      console.error("OpenCage Data API error:", data);
      
      // Fallback to mock coordinates if API fails
      console.log(`📍 OpenCage API failed, using mock coordinates for: ${address}`);
      return getMockCoordinatesForAddress(address);
    }

    // Return coordinates from OpenCage Data
    const location = data.results[0];
    console.log(`🌍 OpenCage API success for "${address}": ${location.geometry.lat}, ${location.geometry.lng}`);
    return {
      lat: location.geometry.lat,
      lng: location.geometry.lng
    };
  } catch (error) {
    console.error("OpenCage Data API error:", error);
    
    // Fallback to mock coordinates on error
    console.log(`⚠️ OpenCage API error, using mock coordinates for: ${address}`);
    return getMockCoordinatesForAddress(address);
  }
}
