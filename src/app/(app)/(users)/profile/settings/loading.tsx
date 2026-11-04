import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mb-20 p-2">
      <Skeleton className="m-2 h-10 w-48" />
      <div className="flex flex-col gap-2 p-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
