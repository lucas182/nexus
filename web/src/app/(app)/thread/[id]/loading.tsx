import { Skeleton, SkeletonCard } from "@/components/skeleton";

export default function ThreadLoading() {
  return (
    <div className="mx-auto max-w-2xl">
      <Skeleton className="mb-4 h-4 w-56" />
      <Skeleton className="mb-6 h-8 w-2/3" />
      <div className="mb-6">
        <SkeletonCard lines={2} />
      </div>
      <Skeleton className="mb-2 h-5 w-52" />
      <div className="flex flex-col gap-3">
        <SkeletonCard lines={1} />
        <SkeletonCard lines={1} />
        <SkeletonCard lines={1} />
      </div>
    </div>
  );
}
