import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="m-2 flex flex-col space-y-2">
      <Skeleton className="h-10 w-48 rounded-md" />
      <Skeleton className="h-10 w-56 rounded-md" />
      <Skeleton className="h-16 w-full rounded-xl" />

      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton className="h-32 w-full rounded-xl" key={`skeleton-${i}`} />
      ))}
    </div>
  )
}