import { PageSkeleton } from '@/components/common/PageSkeleton';

export default function EssentialsLoading() {
  return <PageSkeleton type="list" cardCount={5} />;
}
