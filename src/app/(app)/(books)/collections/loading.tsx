import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="m-2">
      <Skeleton className="h-10 w-48 rounded-md" />
      <div className="mt-2 flex flex-col gap-2">
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    </div>
  );
}
