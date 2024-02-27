import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col">
      <Skeleton className="w-80 h-12 m-2" />
      <Skeleton className="w-full m-2 h-44" />
    </div>
  );
}
