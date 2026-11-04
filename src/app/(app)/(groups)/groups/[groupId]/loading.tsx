import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-2 max-sm:mb-[15vh]">
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="ml-auto h-9 w-24" />
      </div>
      <div className="mt-2 grid gap-2 md:grid-cols-2">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="mt-2 flex flex-col gap-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}
