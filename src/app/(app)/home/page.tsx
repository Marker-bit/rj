import BooksCard from "@/components/main/cards/books-card";
import FirstSteps from "@/components/main/first-steps";
import { Stats } from "@/components/main/stats";
import { StreakInfo } from "@/components/main/streak-info";
import { ModeToggle } from "@/components/mode-toggle";
import Notifications from "@/components/notifications";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import OldUsers from "./old-users";
import SupportButton from "./support-button";

export default function Home() {
  return (
    <div className="p-2">
      <div className="mb-[15vh]">
        <div className="m-2 flex items-center text-5xl font-black">
          Главная
          <div className="ml-auto flex items-center gap-2">
            <ModeToggle />
            <Suspense fallback={<></>}>
              <SupportButton />
            </Suspense>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Suspense fallback={<></>}>
            <OldUsers>
              <Notifications />
            </OldUsers>
          </Suspense>
          <div className="grid lg:grid-cols-2 gap-2">
            <Suspense fallback={<></>}>
              <FirstSteps />
            </Suspense>
            <Suspense fallback={<></>}>
              <StreakInfo />
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
              <div className="flex flex-col gap-2">
                <Skeleton className="h-12 w-80" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              </div>
            }
          >
            <Stats />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
