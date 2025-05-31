'use client';

import { ReviewForm } from '@/components/ReviewForm';
import { useParams } from 'next/navigation';

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

interface ReviewFormWrapperProps {
  businessId: string;
}

export const ReviewFormWrapper = ({ businessId }: ReviewFormWrapperProps) => {
  const handleSubmit = async (reviewData: { rating: number; comment: string; businessId: string }) => {
    const completeReviewData = {
      ...reviewData,
      userId: 'user-123', // Mock user ID for now
      username: 'Test User' // Mock username for now
    };
    
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(completeReviewData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit review');
    }
    
    console.log('Review submitted:', data);
  };

  // Mock business data for testing
  const mockBusiness: Business = {
    id: businessId,
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