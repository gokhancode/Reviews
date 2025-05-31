'use client';

import { ReviewForm } from '@/components/ReviewForm';
import { useState } from 'react';
import { MiniKit, VerificationLevel } from '@worldcoin/minikit-js';

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
  const [isVerified, setIsVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [worldIdProof, setWorldIdProof] = useState<any>(null);

  const handleVerify = async () => {
    setVerifying(true);
    setVerifyError(null);
    try {
      const result = await MiniKit.commandsAsync.verify({
        action: 'leave-review',
        verification_level: VerificationLevel.Orb,
      });
      const response = await fetch('/api/verify-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: result.finalPayload,
          action: 'leave-review',
        }),
      });
      const data = await response.json();
      if (data.verifyRes && data.verifyRes.success) {
        setIsVerified(true);
        setWorldIdProof(result.finalPayload);
      } else {
        setVerifyError('Verification failed. Please try again.');
      }
    } catch (err) {
      setVerifyError('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (reviewData: { rating: number; comment: string; businessId: string }) => {
    if (!worldIdProof) {
      throw new Error('World ID verification required.');
    }
    const completeReviewData = {
      ...reviewData,
      userId: 'user-123',
      username: 'Test User',
      worldIdProof,
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
    <div>
      {!isVerified ? (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {verifying ? 'Verifying...' : 'Verify with World ID to leave a review'}
          </button>
          {verifyError && <p className="text-red-500">{verifyError}</p>}
        </div>
      ) : (
        <ReviewForm
          business={mockBusiness}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}; 