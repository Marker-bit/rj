import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="m-2">
      <Skeleton className="w-48 h-10 rounded-md" />
      <div className="flex flex-col gap-2 mt-2">
        <Skeleton className="w-full h-16 rounded-xl" />
      </div>
    </div>
  );
}