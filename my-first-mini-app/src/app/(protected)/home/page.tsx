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
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    // Load reviews from localStorage on component mount
    const storedReviews = localStorage.getItem('businessReviews');
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }
  }, []);

  const handleBusinessSelect = (business: Business) => {
    setSelectedBusiness(business);
  };

  const handleReviewSubmit = (reviewData: { rating: number; comment: string; businessId: string }) => {
    const newReview: Review = {
      id: Date.now().toString(),
      ...reviewData,
      userId: 'user-' + Date.now(), // Temporary user ID
      username: 'Anonymous', // Temporary username
      createdAt: new Date().toISOString()
    };

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    
    // Save to localStorage
    localStorage.setItem('businessReviews', JSON.stringify(updatedReviews));
    
    // Reset selected business
    setSelectedBusiness(null);
  };

  // Filter reviews for the selected business
  const businessReviews = selectedBusiness
    ? reviews.filter(review => review.businessId === selectedBusiness.id)
    : [];

  return (
    <Page>
      <Page.Header className="bg-white border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-light tracking-tight text-gray-900">Reviews</h1>
          <UserInfo />
        </div>
      </Page.Header>
      <Page.Main className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8">
            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <BusinessMap onBusinessSelect={handleBusinessSelect} />
            </div>
            
            {selectedBusiness && (
              <div className="space-y-8">
                <div className="bg-white rounded-xl p-8 border border-gray-100">
                  <h2 className="text-3xl font-light text-gray-900 mb-3">{selectedBusiness.name}</h2>
                  <p className="text-gray-500 mb-1">{selectedBusiness.type}</p>
                  <p className="text-gray-400 text-sm mb-6">{selectedBusiness.address}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="font-medium text-gray-900">{selectedBusiness.rating}</span>
                    <span className="text-gray-400">({selectedBusiness.reviewCount} reviews)</span>
                  </div>
                </div>

                <ReviewForm
                  business={selectedBusiness}
                  onSubmit={handleReviewSubmit}
                />

                {businessReviews.length > 0 && (
                  <div className="bg-white rounded-xl p-8 border border-gray-100">
                    <h2 className="text-2xl font-light text-gray-900 mb-6">Reviews</h2>
                    <div className="space-y-8">
                      {businessReviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-50 pb-8 last:border-b-0 last:pb-0">
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
                )}
              </div>
            )}
          </div>
        </div>
      </Page.Main>
    </Page>
  );
}
