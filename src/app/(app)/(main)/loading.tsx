import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col">
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-56 h-12 m-2" />
      <Skeleton className="w-full m-2 h-44" />
      <Skeleton className="w-full m-2 h-44" />
      <Skeleton className="w-full m-2 h-44" />
      <Skeleton className="w-80 h-12 m-2" />
      <div className="grid grid-cols-2 m-2 gap-2">
        <Skeleton className="w-full h-14" />
        <Skeleton className="w-full h-14" />
        <Skeleton className="w-full h-14" />
        <Skeleton className="w-full h-14" />
      </div>
      <Skeleton className="w-80 h-12 m-2" />
      <Skeleton className="w-full m-2 h-44" />
    </div>
  );
}
