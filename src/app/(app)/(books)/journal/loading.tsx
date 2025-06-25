import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-2 p-2">
      <Skeleton className="h-10 w-48 rounded-md" />
      <Skeleton className="h-9 w-80 rounded-md" />
    </div>
  )
}
