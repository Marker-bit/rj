import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="m-2 flex flex-col space-y-2">
      <Skeleton className="h-10 w-48 rounded-md" />
      <div className="grid items-stretch gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton className="h-24 w-full rounded-md" key={`skeleton-${i}`} />
        ))}
      </div>
    </div>
  );
}
