import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get("place_id");

  if (!placeId) {
    return NextResponse.json(
      { error: "place_id parameter is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey || placeId.startsWith("mock_")) {
    // Return mock coordinates for development/demo
    const mockCoordinates = {
      mock_1: { lat: 44.9778, lng: -93.265 }, // Minneapolis
      mock_2: { lat: 20.5937, lng: 78.9629 }, // India center
      mock_3: { lat: 55.3781, lng: -3.436 }, // UK center
    };

    const coords = mockCoordinates[placeId as keyof typeof mockCoordinates] || {
      lat: 0,
      lng: 0,
    };

    return NextResponse.json({
      result: {
        geometry: {
          location: coords,
        },
      },
    });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${apiKey}`
    );

    const data = await response.json();

    if (data.status !== "OK") {
      console.error("Google Places Details API error:", data);
      return NextResponse.json(
        { error: "Failed to fetch place details" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching place details:", error);
    return NextResponse.json(
      { error: "Failed to fetch place details" },
      { status: 500 }
    );
  }
}
