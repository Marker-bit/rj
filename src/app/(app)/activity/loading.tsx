import { Skeleton } from "@/components/ui/skeleton"

export default async function Loading() {
  return (
    <div className="flex w-full flex-col gap-2 p-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div className="flex gap-2 rounded-xl border p-2" key={i}>
          <Skeleton className="h-40 w-32 rounded-xl" />
          <div className="flex w-full flex-col gap-2">
            <Skeleton className="h-8 w-1/2 rounded-lg" />
            <Skeleton className="h-4 w-2/5 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}
