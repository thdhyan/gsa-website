import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

// Simple coordinate database for Minnesota and common locations
const locationCoordinates: { [key: string]: { lat: number; lng: number } } = {
  "Minneapolis, MN": { lat: 44.9778, lng: -93.265 },
  "Saint Paul, MN": { lat: 44.9537, lng: -93.09 },
  "Duluth, MN": { lat: 46.7867, lng: -92.1005 },
  "Rochester, MN": { lat: 44.0121, lng: -92.4802 },
  "Bloomington, MN": { lat: 44.8408, lng: -93.2983 },
  "Plymouth, MN": { lat: 45.0105, lng: -93.4555 },
  "Woodbury, MN": { lat: 44.9239, lng: -92.9594 },
  "Eagan, MN": { lat: 44.8041, lng: -93.1668 },
  "Burnsville, MN": { lat: 44.7677, lng: -93.2777 },
  "Eden Prairie, MN": { lat: 44.8547, lng: -93.4708 },
  "New York, NY": { lat: 40.7128, lng: -74.006 },
  "Los Angeles, CA": { lat: 34.0522, lng: -118.2437 },
  "Chicago, IL": { lat: 41.8781, lng: -87.6298 },
  "London, UK": { lat: 51.5074, lng: -0.1278 },
  "Tokyo, Japan": { lat: 35.6762, lng: 139.6503 },
  "Mumbai, India": { lat: 19.076, lng: 72.8777 },
  "Ahmedabad, India": { lat: 23.0225, lng: 72.5714 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  "Toronto, Canada": { lat: 43.6532, lng: -79.3832 },
  "Berlin, Germany": { lat: 52.52, lng: 13.405 },
  "Beijing, China": { lat: 39.9042, lng: 116.4074 },
  "Sydney, Australia": { lat: -33.8688, lng: 151.2093 },
};

interface Signup {
  id?: number;
  name: string;
  email: string;
  location: string;
  mediaConsent: boolean;
  latitude?: number;
  longitude?: number;
  created_at?: string;
}

// Initialize Neon connection
let sql: ReturnType<typeof neon> | null = null;

function initializeNeon() {
  if (!sql && process.env.DATABASE_URL) {
    try {
      sql = neon(process.env.DATABASE_URL);
      console.log("✅ Neon database connected successfully");
    } catch (error) {
      console.error("❌ Neon connection failed:", error);
    }
  }
}

// Get coordinates for a location
function getCoordinatesForLocation(
  location: string
): { lat: number; lng: number } | null {
  // Direct match
  if (locationCoordinates[location]) {
    return locationCoordinates[location];
  }

  // Fuzzy match for cities
  const normalizedLocation = location.toLowerCase();
  for (const [key, coords] of Object.entries(locationCoordinates)) {
    if (
      key.toLowerCase().includes(normalizedLocation) ||
      normalizedLocation.includes(key.toLowerCase().split(",")[0])
    ) {
      return coords;
    }
  }

  // Default to Minneapolis if no match found
  console.log(
    `⚠️ No coordinates found for "${location}", defaulting to Minneapolis`
  );
  return locationCoordinates["Minneapolis, MN"];
}

// GET endpoint - Fetch all signups from Neon
export async function GET() {
  try {
    initializeNeon();

    if (!sql) {
      console.log("⚠️ Database not available, using sample data");
      // Return sample data if database is not available
      const sampleData: Signup[] = [
        {
          id: 1,
          name: "John Doe",
          email: "john.doe@umn.edu",
          location: "Minneapolis, MN",
          mediaConsent: true,
          latitude: 44.9778,
          longitude: -93.265,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane.smith@umn.edu",
          location: "Saint Paul, MN",
          mediaConsent: false,
          latitude: 44.9537,
          longitude: -93.09,
          created_at: new Date().toISOString(),
        },
      ];

      return NextResponse.json(sampleData);
    }

    const signups = await sql`
      SELECT 
        id,
        name,
        email,
        location,
        media_consent as "mediaConsent",
        latitude,
        longitude,
        created_at
      FROM signups 
      ORDER BY created_at DESC
    ` as Signup[];

    console.log(`📋 Retrieved ${signups.length} signups from Neon database`);
    return NextResponse.json(signups);
  } catch (error) {
    console.error("❌ Error fetching signups:", error);
    return NextResponse.json(
      { error: "Failed to fetch signups" },
      { status: 500 }
    );
  }
}

// POST endpoint - Create new signup in Neon
export async function POST(request: NextRequest) {
  try {
    initializeNeon();

    const body = await request.json();
    const { name, email, location, mediaConsent } = body;

    // Validate required fields
    if (!name || !email || !location) {
      return NextResponse.json(
        { error: "Name, email, and location are required" },
        { status: 400 }
      );
    }

    // Get coordinates for the location
    const coordinates = getCoordinatesForLocation(location);

    if (!sql) {
      console.log("⚠️ Database not available, signup not saved");
      return NextResponse.json(
        { error: "Database not available. Please try again later." },
        { status: 503 }
      );
    }

    // Insert into Neon database
    const result = await sql`
      INSERT INTO signups (name, email, location, media_consent, latitude, longitude)
      VALUES (${name}, ${email}, ${location}, ${mediaConsent || false}, ${
      coordinates?.lat || null
    }, ${coordinates?.lng || null})
      RETURNING 
        id,
        name,
        email,
        location,
        media_consent as "mediaConsent",
        latitude,
        longitude,
        created_at
    ` as Signup[];

    const newSignup = result[0];
    console.log(
      `✅ New GSA signup created: ${newSignup.name} from ${newSignup.location}`
    );

    return NextResponse.json(newSignup, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("❌ Error creating signup:", error);

    // Handle unique constraint violation (duplicate email)
    if (
      errorMessage?.includes("duplicate key value") ||
      errorMessage?.includes("unique constraint")
    ) {
      return NextResponse.json(
        { error: "This email is already registered for the event" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create signup. Please try again." },
      { status: 500 }
    );
  }
}
