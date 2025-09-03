import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("input");

  if (!input) {
    return NextResponse.json(
      { error: "Input parameter is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    // Return mock data for development/demo
    const mockPredictions = [
      {
        place_id: "mock_1",
        description: `${input}, MN, USA`,
        structured_formatting: {
          main_text: input,
          secondary_text: "MN, USA",
        },
      },
      {
        place_id: "mock_2",
        description: `${input}, India`,
        structured_formatting: {
          main_text: input,
          secondary_text: "India",
        },
      },
      {
        place_id: "mock_3",
        description: `${input}, United Kingdom`,
        structured_formatting: {
          main_text: input,
          secondary_text: "United Kingdom",
        },
      },
    ];

    return NextResponse.json({ predictions: mockPredictions });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&types=(cities)&key=${apiKey}`
    );

    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Google Places API error:", data);
      return NextResponse.json(
        { error: "Failed to fetch places" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching places:", error);
    return NextResponse.json(
      { error: "Failed to fetch places" },
      { status: 500 }
    );
  }
}
