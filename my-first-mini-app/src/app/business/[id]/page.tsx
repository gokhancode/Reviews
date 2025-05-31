import { Page } from '@/components/PageLayout';
import { ReviewFormWrapper } from '@/components/ReviewFormWrapper';
import { prisma } from '@/lib/prisma';
import type { Review } from '.prisma/client';

async function getReviews(businessId: string) {
  console.log('Fetching reviews for businessId:', businessId);
  const reviews = await prisma.review.findMany({
    where: {
      businessId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  console.log('Found reviews:', reviews);
  return reviews;
}

export default async function BusinessPage({ params }: { params: { id: string } }) {
  console.log('Page params:', params);
  const reviews = await getReviews(params.id);

  return (
    <Page>
      <Page.Main className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Reviews</h1>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review: Review) => (
                <div key={review.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400">★</span>
                    <span className="font-medium">{review.rating}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{review.username}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <ReviewFormWrapper businessId={params.id} />
      </Page.Main>
    </Page>
  );
} 