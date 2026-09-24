import { PageSkeleton } from '@/components/common/PageSkeleton';

export default function Loading() {
  return <PageSkeleton type="default" cardCount={5} />;
}
