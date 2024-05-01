import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col">
      <div className="text-5xl font-black m-2 flex items-center">Главная</div>
      <div className="flex flex-col m-2 gap-2">
        <Skeleton className="w-56 h-12" />
        <Skeleton className="w-full h-44" />
        <Skeleton className="w-full h-44" />
        <Skeleton className="w-full h-44" />
      </div>
      <div className="flex flex-col gap-2 m-2">
        <Skeleton className="w-80 h-12" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="w-full h-14" />
          <Skeleton className="w-full h-14" />
          <Skeleton className="w-full h-14" />
          <Skeleton className="w-full h-14" />
        </div>
      </div>
      <div className="flex flex-col gap-2 m-2">
        <Skeleton className="w-80 h-12" />
        <Skeleton className="w-full h-44" />
      </div>
    </div>
  )
}
