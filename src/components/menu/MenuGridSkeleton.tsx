import { Skeleton } from "@/components/ui/skeleton";

export function MenuGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className="h-96 rounded-xl" />
      ))}
    </div>
  );
}