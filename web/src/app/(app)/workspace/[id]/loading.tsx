import { Skeleton, SkeletonCard } from "@/components/skeleton";

export default function WorkspaceLoading() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="mb-8">
        <SkeletonCard lines={3} />
      </div>
      <Skeleton className="mb-3 h-5 w-40" />
      <div className="flex flex-col gap-3">
        <SkeletonCard lines={2} />
        <SkeletonCard lines={2} />
      </div>
    </div>
  );
}
