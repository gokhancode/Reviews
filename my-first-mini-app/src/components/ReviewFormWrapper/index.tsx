'use client';

import { ReviewForm } from '@/components/ReviewForm';

interface Business {
  id: string;
  name: string;
  location: [number, number];
  rating: number;
  reviewCount: number;
  type: string;
  address: string;
  placeId?: string;
}

export const ReviewFormWrapper = () => {
  const handleSubmit = (reviewData: { rating: number; comment: string; businessId: string }) => {
    console.log('New review:', reviewData);
    // TODO: Submit review to backend
  };

  // Mock business data for testing
  const mockBusiness: Business = {
    id: '1',
    name: 'Test Business',
    location: [50.0755, 14.4378],
    rating: 4.5,
    reviewCount: 120,
    type: 'Restaurant',
    address: '123 Test Street'
  };

  return (
    <ReviewForm
      business={mockBusiness}
      onSubmit={handleSubmit}
    />
  );
}; 