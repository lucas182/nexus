import { Skeleton, SkeletonCard } from "@/components/skeleton";

export default function RadarLoading() {
  return (
    <div className="mx-auto max-w-3xl">
      <Skeleton className="mb-6 h-8 w-32" />
      <div className="mb-6">
        <SkeletonCard lines={2} />
      </div>
      <div className="flex flex-col gap-3">
        <SkeletonCard lines={2} />
        <SkeletonCard lines={2} />
      </div>
    </div>
  );
}
