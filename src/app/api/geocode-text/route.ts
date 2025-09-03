import { NextResponse } from "next/server";
import { geocodeAddress } from "@/lib/geocoding";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "address parameter is required" },
      { status: 400 }
    );
  }

  try {
    const coordinates = await geocodeAddress(address);

    if (!coordinates) {
      return NextResponse.json(
        { error: "Could not geocode address" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      results: [{
        geometry: {
          location: coordinates,
        },
        formatted_address: address,
      }],
      status: "OK"
    });
  } catch (error) {
    console.error("Geocoding error:", error);
    return NextResponse.json(
      { error: "Geocoding failed" },
      { status: 500 }
    );
  }
}
