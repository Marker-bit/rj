import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="m-2 flex flex-col gap-2">
      <Skeleton className="h-12 w-[80vw] rounded-xl" />
      <Skeleton className="h-5 w-10 rounded-md" />
      <Skeleton className="mt-2 h-9 w-52 rounded-md" />
      <div className="flex gap-2 p-2">
        <Skeleton className="mt-2 h-40 w-28 rounded-md" />
        <div className="flex flex-col gap-1">
          <Skeleton className="mt-2 h-7 w-52 rounded-md" />
          <Skeleton className="mt-2 h-5 w-40 rounded-md" />
        </div>
        <div className="my-auto ml-auto size-fit">
          <Skeleton className="size-6 rounded-md" />
        </div>
      </div>
      <div className="flex gap-2 p-2">
        <Skeleton className="mt-2 h-40 w-28 rounded-md" />
        <div className="flex flex-col gap-1">
          <Skeleton className="mt-2 h-7 w-52 rounded-md" />
          <Skeleton className="mt-2 h-5 w-40 rounded-md" />
        </div>
        <div className="my-auto ml-auto size-fit">
          <Skeleton className="size-6 rounded-md" />
        </div>
      </div>
      <Skeleton className="mt-2 h-9 w-52 rounded-md" />
      <div className="flex gap-2 p-2">
        <Skeleton className="mt-2 h-40 w-28 rounded-md" />
        <div className="flex flex-col gap-1">
          <Skeleton className="mt-2 h-7 w-52 rounded-md" />
          <Skeleton className="mt-2 h-5 w-40 rounded-md" />
        </div>
        <div className="my-auto ml-auto size-fit">
          <Skeleton className="size-6 rounded-md" />
        </div>
      </div>
    </div>
  );
}
