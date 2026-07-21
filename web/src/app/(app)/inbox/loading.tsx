import { Skeleton, SkeletonCard } from "@/components/skeleton";

export default function InboxLoading() {
  return (
    <div className="mx-auto max-w-2xl">
      <Skeleton className="mb-2 h-8 w-40" />
      <Skeleton className="mb-6 h-4 w-64" />
      <div className="flex flex-col gap-3">
        <SkeletonCard lines={2} />
        <SkeletonCard lines={1} />
        <SkeletonCard lines={2} />
      </div>
    </div>
  );
}
