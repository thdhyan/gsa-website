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

  // Handle Nominatim place IDs that contain coordinates
  if (placeId.startsWith("nominatim_")) {
    const coordsPart = placeId.replace("nominatim_", "");
    const [lat, lng] = coordsPart.split("_").map(Number);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      return NextResponse.json({
        result: {
          geometry: {
            location: { lat, lng },
          },
        },
      });
    }
  }

  // Handle PositionStack place IDs (legacy support)
  if (placeId.startsWith("positionstack_")) {
    const coordsPart = placeId.replace("positionstack_", "");
    const [lat, lng] = coordsPart.split("_").map(Number);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      return NextResponse.json({
        result: {
          geometry: {
            location: { lat, lng },
          },
        },
      });
    }
  }

  // Handle mock place IDs
  if (placeId.startsWith("mock_")) {
    const mockCoordinates = {
      mock_1: { lat: 44.9778, lng: -93.265 }, // Minneapolis
      mock_2: { lat: 20.5937, lng: 78.9629 }, // India center
      mock_3: { lat: 55.3781, lng: -3.436 }, // UK center
    };

    const coords = mockCoordinates[placeId as keyof typeof mockCoordinates] || {
      lat: 44.9778,
      lng: -93.265,
    };

    return NextResponse.json({
      result: {
        geometry: {
          location: coords,
        },
      },
    });
  }

  // For any other place IDs, try to extract coordinates or return default
  console.error("Unknown place_id format:", placeId);
  return NextResponse.json({
    result: {
      geometry: {
        location: { lat: 44.9778, lng: -93.265 }, // Default to Minneapolis
      },
    },
  });
}
