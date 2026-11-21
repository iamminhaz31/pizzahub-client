import { Skeleton } from "@/components/ui/skeleton";

export function ItemDetailsSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-3">
        <Skeleton className="aspect-[4/3] w-full rounded-xl" />
        <div className="flex gap-2">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="size-16 rounded-md" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  );
}