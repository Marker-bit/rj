import BooksCard from "@/components/main/cards/books-card";
import LastReadCard from "@/components/main/cards/last-read-card";
import FirstSteps from "@/components/main/first-steps";
import { Stats } from "@/components/main/stats";
import { StreakInfo } from "@/components/main/streak-info";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="p-2">
      <div className="mb-[15vh]">
        <div className="m-2 flex items-center text-5xl font-black">Главная</div>
        <div className="flex flex-col gap-2">
          <div className="grid lg:grid-cols-2 gap-2">
            <Suspense fallback={<></>}>
              <FirstSteps />
            </Suspense>
            <Suspense fallback={<Skeleton className="rounded-md h-full min-h-60 w-full" />}>
              <StreakInfo />
            </Suspense>
            <Suspense fallback={<Skeleton className="rounded-md h-full min-h-60 w-full" />}>
              <LastReadCard />
            </Suspense>
          </div>
          <Suspense
            fallback={
              <div className="flex flex-col gap-2">
                <Skeleton className="h-12 w-56" />
                <Skeleton className="h-44 w-full" />
                <Skeleton className="h-44 w-full" />
                <Skeleton className="h-44 w-full" />
              </div>
            }
          >
            <BooksCard />
          </Suspense>
          <Suspense
            fallback={
              <Skeleton className="rounded-md h-[300px] w-full" />
            }
          >
            <Stats />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
