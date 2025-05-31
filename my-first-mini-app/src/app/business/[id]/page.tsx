import { Page } from '@/components/PageLayout';
import { ReviewFormWrapper } from '@/components/ReviewFormWrapper';

export default function BusinessPage({ params }: { params: { id: string } }) {
  return (
    <Page>
      <Page.Main className="max-w-4xl mx-auto py-8 px-4">
        <ReviewFormWrapper />
      </Page.Main>
    </Page>
  );
} 