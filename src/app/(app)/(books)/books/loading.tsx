import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <Skeleton className="h-10 w-48 rounded-md" />
      <Skeleton className="h-9 w-40 rounded-md" />
      <div className="grid md:grid-cols-2 gap-2">
        <Skeleton className="h-[72px] rounded-md" />
        <Skeleton className="h-[72px] rounded-md" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 rounded-md grow" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
      <Skeleton className="h-[252px] w-[1322px] rounded-md" />
      <Skeleton className="h-[252px] w-[1322px] rounded-md" />
    </div>
  );
}
