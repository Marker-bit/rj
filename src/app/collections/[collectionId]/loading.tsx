import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="m-2 flex flex-col gap-2">
      <Skeleton className="w-[80vw] h-12 rounded-xl" />
      <Skeleton className="w-10 h-5 rounded-md" />
      <Skeleton className="w-52 h-9 rounded-md mt-2" />
      <div className="flex gap-2 p-2">
        <Skeleton className="w-28 h-40 rounded-md mt-2" />
        <div className="flex flex-col gap-1">
          <Skeleton className="w-52 h-7 rounded-md mt-2" />
          <Skeleton className="w-40 h-5 rounded-md mt-2" />
        </div>
        <div className="ml-auto my-auto h-fit w-fit">
          <Skeleton className="w-6 h-6 rounded-md" />
        </div>
      </div>
      <div className="flex gap-2 p-2">
        <Skeleton className="w-28 h-40 rounded-md mt-2" />
        <div className="flex flex-col gap-1">
          <Skeleton className="w-52 h-7 rounded-md mt-2" />
          <Skeleton className="w-40 h-5 rounded-md mt-2" />
        </div>
        <div className="ml-auto my-auto h-fit w-fit">
          <Skeleton className="w-6 h-6 rounded-md" />
        </div>
      </div>
      <Skeleton className="w-52 h-9 rounded-md mt-2" />
      <div className="flex gap-2 p-2">
        <Skeleton className="w-28 h-40 rounded-md mt-2" />
        <div className="flex flex-col gap-1">
          <Skeleton className="w-52 h-7 rounded-md mt-2" />
          <Skeleton className="w-40 h-5 rounded-md mt-2" />
        </div>
        <div className="ml-auto my-auto h-fit w-fit">
          <Skeleton className="w-6 h-6 rounded-md" />
        </div>
      </div>
    </div>
  );
}
