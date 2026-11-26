import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-3 pt-2 sm:px-6 sm:pt-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-11 w-36 rounded-md" />
        <Skeleton className="ml-auto h-9 w-28 rounded-full" />
      </div>
      <Skeleton className="h-24 w-full rounded-xl" />
    </main>
  );
}
