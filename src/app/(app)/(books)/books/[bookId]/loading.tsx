import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-2 max-sm:mb-[15vh]">
      <Skeleton className="mb-2 h-9 w-32" />
      <div className="flex gap-2 rounded-md border p-2">
        <Skeleton className="h-40 w-28" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}
