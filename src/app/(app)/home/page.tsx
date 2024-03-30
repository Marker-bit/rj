import { Books } from "@/components/main/books";
import { Profile } from "@/components/main/profile";
import { Stats } from "@/components/main/stats";
import { ModeToggle } from "@/components/mode-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="mb-[15vh]">
      <div className="text-5xl font-black m-2 flex items-center">
        Главная
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </div>
      <div className="flex flex-col">
        <Suspense
          fallback={
            <div className="flex flex-col m-2 gap-2">
              <Skeleton className="w-56 h-12" />
              <Skeleton className="w-full h-44" />
              <Skeleton className="w-full h-44" />
              <Skeleton className="w-full h-44" />
            </div>
          }
        >
          <Books />
        </Suspense>
        <Suspense
          fallback={
            <div className="flex flex-col gap-2 m-2">
              <Skeleton className="w-80 h-12" />
              <div className="grid grid-cols-2 gap-2">
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
            <div className="flex flex-col gap-2 m-2">
              <Skeleton className="w-80 h-12" />
              <Skeleton className="w-full h-44" />
            </div>
          }
        >
          <Profile />
        </Suspense>
      </div>
    </div>
  );
}
