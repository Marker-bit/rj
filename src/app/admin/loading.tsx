import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="m-2 flex flex-col space-y-2">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton className="h-32 w-full rounded-md" key={`skeleton-${i}`} />
        ))}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-[90vh] w-full rounded-md xl:col-span-2" />
        <Skeleton className="h-[90vh] w-full rounded-md" />
      </div>
    </div>
  )
}
