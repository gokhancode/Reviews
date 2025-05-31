import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { error: 'Search query is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&addressdetails=1&limit=10`,
      {
        headers: {
          'User-Agent': 'YourAppName/1.0' // Replace with your app name
        }
      }
    );

    const data = await response.json();

    // Transform the data to match our business format
    const businesses = data.map((place: any) => ({
      id: place.place_id,
      name: place.display_name.split(',')[0],
      location: [parseFloat(place.lat), parseFloat(place.lon)],
      rating: 0, // Will be calculated from reviews
      reviewCount: 0, // Will be calculated from reviews
      type: place.type,
      address: place.display_name,
      placeId: place.place_id
    }));

    return NextResponse.json(businesses);
  } catch (error) {
    console.error('Error searching businesses:', error);
    return NextResponse.json(
      { error: 'Failed to search businesses' },
      { status: 500 }
    );
  }
} 