'use client';

import { ListItem } from '@worldcoin/mini-apps-ui-kit-react';
import { useEffect, useState } from 'react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  businessId: string;
  userId: string;
  username: string;
  createdAt: string;
}

interface ReviewListProps {
  businessId: string;
}

export const ReviewList = ({ businessId }: ReviewListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    // TODO: Fetch reviews from your backend
    const mockReviews: Review[] = [
      {
        id: '1',
        rating: 5,
        comment: 'Great place! The food was amazing.',
        businessId: '1',
        userId: 'user1',
        username: 'JohnDoe',
        createdAt: new Date().toISOString()
      }
    ];
    setReviews(mockReviews);
  }, [businessId]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Reviews</h2>
      {reviews.map((review) => (
        <div key={review.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">{review.username}</span>
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">★</span>
              <span>{review.rating}</span>
            </div>
          </div>
          <p className="text-gray-600">{review.comment}</p>
          <p className="text-sm text-gray-400 mt-2">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}; 