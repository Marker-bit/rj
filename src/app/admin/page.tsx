import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { db } from "@/lib/db"
import { declOfNum } from "@/lib/utils"
import { endOfDay, startOfDay } from "date-fns"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { Suspense } from "react"
import UsersCountCard from "./cards/users-count"
import { Skeleton } from "@/components/ui/skeleton"
import BooksCountCard from "./cards/books-count"

export default async function Page() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-3xl font-bold">Управление</h1>
      <div className="grid gap-4 sm:grid-cols-6">
        <Suspense
          fallback={
            <Skeleton className="h-36 rounded-xl sm:col-span-5 sm:w-auto" />
          }
        >
          <UsersCountCard />
        </Suspense>
        <Suspense
          fallback={
            <Skeleton className="h-36 min-w-36 rounded-xl" />
          }
        >
          <BooksCountCard />
        </Suspense>
      </div>
    </div>
  )
}
