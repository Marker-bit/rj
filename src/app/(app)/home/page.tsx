import { Books } from "@/components/main/books";
import { Profile } from "@/components/main/profile";
import { Stats } from "@/components/main/stats";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function Home() {
  return (
    <div>
      <div className="flex p-1 min-h-10 items-center bg-zinc-100 border-b border-zinc-200 relative">
        <div className="font-semibold mx-auto">Главная</div>
      </div>
      <div className="flex flex-col">
        <Suspense
          fallback={
            <div className="flex flex-col">
              <Skeleton className="w-56 h-12 m-2" />
              <Skeleton className="w-full m-2 h-44" />
              <Skeleton className="w-full m-2 h-44" />
              <Skeleton className="w-full m-2 h-44" />
            </div>
          }
        >
          <Books />
        </Suspense>
        <Suspense
          fallback={
            <div className="flex flex-col">
              <Skeleton className="w-80 h-12 m-2" />
              <div className="grid grid-cols-2 m-2 gap-2">
                <Skeleton className="w-full h-14" />
                <Skeleton className="w-full h-14" />
                <Skeleton className="w-full h-14" />
                <Skeleton className="w-full h-14" />
              </div>
            </div>
          }
        >
          <Stats />
        </Suspense>
        <Suspense
          fallback={
            <div className="flex flex-col">
              <Skeleton className="w-80 h-12 m-2" />
              <Skeleton className="w-full m-2 h-44" />
            </div>
          }
        >
          <Profile />
        </Suspense>
      </div>
    </div>
  );
}
