import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import BooksCountCard from "./cards/books-count";
import BooksCountInfo from "./cards/books-count-info";
import UsersCountCard from "./cards/users-count";

export default async function Page() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-3xl font-bold">Управление</h1>
      <div className="grid gap-4 sm:grid-cols-6">
        <Suspense
          fallback={
            <Skeleton className="h-36 rounded-xl sm:col-span-6 sm:w-auto" />
          }
        >
          <UsersCountCard />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-36 min-w-36 rounded-xl" />}>
          <BooksCountCard />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-36 min-w-36 rounded-xl" />}>
          <BooksCountInfo />
        </Suspense>
      </div>
    </div>
  )
}
