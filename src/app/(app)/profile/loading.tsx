import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col m-2">
      <Skeleton className="w-full h-28" />
      <div className="flex justify-center">
        <Skeleton className="w-80 h-12 m-2" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="w-full h-14" />
        <Skeleton className="w-full h-14" />
        <Skeleton className="w-full h-14" />
        <Skeleton className="w-full h-14" />
      </div>
    </div>
  );
}
