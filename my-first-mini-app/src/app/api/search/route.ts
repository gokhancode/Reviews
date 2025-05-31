import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Review } from '.prisma/client';

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
    console.log('Searching for:', query);
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

    if (!response.ok) {
      console.error('OpenStreetMap API error:', response.status, response.statusText);
      throw new Error(`OpenStreetMap API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenStreetMap results:', data.length, 'places found');

    // Transform the data to match our business format
    const businesses = await Promise.all(data.map(async (place: any) => {
      try {
        console.log('Processing place:', place.place_id);
        // Get review statistics for this business
        const reviews = await prisma.review.findMany({
          where: {
            businessId: place.place_id.toString(),
          },
        });
        console.log('Found reviews for place', place.place_id, ':', reviews.length);

        const reviewCount = reviews.length;
        const averageRating = reviewCount > 0
          ? reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviewCount
          : 0;
        console.log('Review stats for place', place.place_id, ':', { reviewCount, averageRating });

        const business = {
          id: place.place_id.toString(),
          name: place.display_name.split(',')[0],
          location: [parseFloat(place.lat), parseFloat(place.lon)],
          rating: averageRating,
          reviewCount,
          type: place.type,
          address: place.display_name,
          placeId: place.place_id.toString()
        };
        console.log('Processed business:', business);
        return business;
      } catch (error) {
        console.error('Error processing place:', place.place_id, error);
        // Return a basic business object without review stats if there's an error
        return {
          id: place.place_id.toString(),
          name: place.display_name.split(',')[0],
          location: [parseFloat(place.lat), parseFloat(place.lon)],
          rating: 0,
          reviewCount: 0,
          type: place.type,
          address: place.display_name,
          placeId: place.place_id.toString()
        };
      }
    }));

    console.log('Final processed businesses:', businesses);
    return NextResponse.json(businesses);
  } catch (error) {
    console.error('Error searching businesses:', error);
    return NextResponse.json(
      { error: 'Failed to search businesses', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 