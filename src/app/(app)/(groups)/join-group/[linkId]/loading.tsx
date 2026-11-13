import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col p-4 max-sm:mb-[15vh] md:min-h-screen md:items-center md:justify-center">
      <div className="flex flex-col gap-3 rounded-xl border p-4 max-sm:w-full md:m-1 md:min-w-[30vw]">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-9 w-40" />
      </div>
    </div>
  );
}
