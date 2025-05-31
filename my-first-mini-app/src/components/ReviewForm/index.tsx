'use client';

import { useState } from 'react';

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

interface ReviewFormProps {
  business: Business;
  onSubmit: (review: { rating: number; comment: string; businessId: string }) => Promise<void>;
}

export const ReviewForm = ({ business, onSubmit }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!business) {
    return null;
  }

  const isFormValid = rating > 0 && comment.trim().length >= 10;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) {
      if (rating === 0) {
        setError('Please select a rating');
      } else if (comment.trim().length < 10) {
        setError('Please write at least 10 characters');
      }
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onSubmit({
        rating,
        comment,
        businessId: business.id
      });
      setRating(0);
      setComment('');
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
      <h2 className="text-2xl font-light text-gray-900 mb-6">Write a Review</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-4">
            Rating
          </label>
          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`text-4xl focus:outline-none transition-transform hover:scale-110 ${
                  star <= (hoveredRating || rating) ? 'text-yellow-400' : 'text-gray-200'
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                {star <= (hoveredRating || rating) ? '★' : '☆'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-4">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-3 border border-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200 text-gray-900 placeholder-gray-400 resize-none"
            rows={4}
            placeholder="Share your experience..."
            required
            minLength={10}
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
            isSubmitting || !isFormValid
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}; 