import { Books } from "@/components/main/books"
import { Profile } from "@/components/main/profile"
import { Stats } from "@/components/main/stats"
import { StreakInfo } from "@/components/main/streak-info"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageCircleQuestion } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import SupportButton from "./support-button";

export const dynamic = "force-dynamic"

export default function Home() {
  return (
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
      <Suspense fallback={<></>}>
        <StreakInfo />
      </Suspense>
      <div className="flex flex-col">
        <Suspense
          fallback={
            <div className="m-2 flex flex-col gap-2">
              <Skeleton className="h-12 w-56" />
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-44 w-full" />
            </div>
          }
        >
          <Books />
        </Suspense>
        <Suspense
          fallback={
            <div className="m-2 flex flex-col gap-2">
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
        <Suspense
          fallback={
            <div className="m-2 flex flex-col gap-2">
              <Skeleton className="h-12 w-80" />
              <Skeleton className="h-44 w-full" />
            </div>
          }
        >
          <Profile />
        </Suspense>
      </div>
    </div>
  )
}
