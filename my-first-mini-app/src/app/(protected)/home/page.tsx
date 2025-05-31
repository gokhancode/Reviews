'use client';

import { Page } from '@/components/PageLayout';
import { BusinessMap } from '@/components/BusinessMap';
import { ReviewForm } from '@/components/ReviewForm';
import { useState, useEffect } from 'react';
import { UserInfo } from '@/components/UserInfo';

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

interface Review {
  id: string;
  rating: number;
  comment: string;
  businessId: string;
  userId: string;
  username: string;
  createdAt: string;
}

export default function Home() {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [businessReviews, setBusinessReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  useEffect(() => {
    if (selectedBusiness) {
      fetchReviews(selectedBusiness.id);
    }
  }, [selectedBusiness]);

  const fetchReviews = async (businessId: string) => {
    setIsLoadingReviews(true);
    try {
      const response = await fetch(`/api/reviews?businessId=${businessId}`);
      const data = await response.json();
      setBusinessReviews(data);

      // Calculate average rating and update business
      if (data.length > 0) {
        const avgRating = data.reduce((acc: number, review: Review) => acc + review.rating, 0) / data.length;
        setSelectedBusiness(prev => prev ? {
          ...prev,
          rating: avgRating,
          reviewCount: data.length
        } : null);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleBusinessSelect = (business: Business) => {
    setSelectedBusiness(business);
  };

  const handleReviewSubmit = async (reviewData: { rating: number; comment: string; businessId: string }) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...reviewData,
          userId: 'user123', // Replace with actual user ID
          username: 'Anonymous User' // Replace with actual username
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // Refresh reviews after submission
      await fetchReviews(reviewData.businessId);
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  return (
    <Page className="!p-0">
      <Page.Main className="!p-0">
        <div className="fixed inset-0 h-dvh w-screen bg-white pb-safe">
          <BusinessMap onBusinessSelect={handleBusinessSelect} />
          {selectedBusiness && (
            <div className="absolute top-4 right-4 w-96 max-h-[calc(100dvh-2rem)] overflow-y-auto bg-white rounded-xl shadow-lg">
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-3">{selectedBusiness.name}</h2>
                  <p className="text-gray-500 mb-1">{selectedBusiness.type}</p>
                  <p className="text-gray-400 text-sm mb-6">{selectedBusiness.address}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="font-medium text-gray-900">{selectedBusiness.rating.toFixed(1)}</span>
                    <span className="text-gray-400">({selectedBusiness.reviewCount} reviews)</span>
                  </div>
                </div>

                <ReviewForm
                  business={selectedBusiness}
                  onSubmit={handleReviewSubmit}
                />

                {isLoadingReviews ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  </div>
                ) : businessReviews.length > 0 ? (
                  <div>
                    <h2 className="text-2xl font-light text-gray-900 mb-6">Reviews</h2>
                    <div className="space-y-6">
                      {businessReviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-50 pb-6 last:border-b-0 last:pb-0">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-gray-900">{review.username}</span>
                            <span className="text-yellow-400">★ {review.rating}</span>
                          </div>
                          <p className="text-gray-600 mb-3">{review.comment}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    No reviews yet. Be the first to review this place!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Page.Main>
    </Page>
  );
}
