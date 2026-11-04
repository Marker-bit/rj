import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center gap-2">
        <Skeleton className="size-20 rounded-full" />
        <Skeleton className="h-8 w-48" />
      </div>
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
