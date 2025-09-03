import { NextResponse } from "next/server";

// Define the Nominatim location response type for search
interface NominatimLocation {
  lat: string;
  lon: string;
  display_name: string;
  place_id: number;
  osm_type: string;
  osm_id: number;
  type: string;
  class: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("input");

  if (!input) {
    return NextResponse.json(
      { error: "Input parameter is required" },
      { status: 400 }
    );
  }

  // Return mock data for very short inputs or provide fallback
  if (input.length < 2) {
    const mockPredictions = [
      {
        place_id: `mock_${input}_1`,
        description: `${input}, MN, USA`,
        structured_formatting: {
          main_text: input,
          secondary_text: "MN, USA",
        },
      },
    ];
    return NextResponse.json({ predictions: mockPredictions });
  }

  try {
    // Use Nominatim (OpenStreetMap) Search API for autocomplete suggestions
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        input
      )}&limit=5&addressdetails=1`,
      {
        headers: {
          "User-Agent": "GSA-Website/1.0 (University of Minnesota)",
        },
      }
    );

    const data: NominatimLocation[] = await response.json();

    if (!response.ok || !data) {
      console.error("Nominatim API error:", data);
      return NextResponse.json({ predictions: [] });
    }

    // Convert Nominatim response to our expected format
    const predictions = data.map((location: NominatimLocation) => {
      // Parse display_name to extract main text and secondary text
      const parts = location.display_name.split(", ");
      const main_text = parts[0] || input;
      const secondary_text = parts.slice(1).join(", ") || "";

      return {
        place_id: `nominatim_${location.lat}_${location.lon}`,
        description: location.display_name,
        structured_formatting: {
          main_text,
          secondary_text,
        },
        // Store coordinates in the place_id for easy retrieval
        coordinates: {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon),
        },
      };
    });

    return NextResponse.json({ predictions });
  } catch (error) {
    console.error("Nominatim Places API error:", error);
    return NextResponse.json({ predictions: [] });
  }
}
