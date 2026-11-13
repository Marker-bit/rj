import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="m-2 flex flex-col items-start gap-2 max-sm:mb-[15vh]">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-4 w-80 max-w-full" />
      <Skeleton className="h-9 w-40" />
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="w-full rounded-xl border p-4">
          <Skeleton className="mb-2 h-5 w-2/3" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
