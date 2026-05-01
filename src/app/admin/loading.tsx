import { Skeleton } from "@/components/ui/skeleton";

const statSkeletons = Array.from({ length: 4 }, (_, index) => ({
  id: `admin-stat-skeleton-${index}`,
}));

export default function Loading() {
  return (
    <div className="m-2 flex flex-col space-y-2">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {statSkeletons.map((skeleton) => (
          <Skeleton className="h-32 w-full rounded-md" key={skeleton.id} />
        ))}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-[90vh] w-full rounded-md xl:col-span-2" />
        <Skeleton className="h-[90vh] w-full rounded-md" />
      </div>
    </div>
  );
}
