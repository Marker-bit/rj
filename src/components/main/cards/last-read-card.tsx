import { Button } from "@/components/ui/button";
import { getLastReadBook } from "@/lib/books";
import { validateRequest } from "@/lib/server-validate-request";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function LastReadCard() {
  const { user } = await validateRequest();
  if (!user) return null;
  const data = await getLastReadBook(user.id);
  if (!data) return null;

  const { book: lastReadBook, pages } = data;

  return (
    <div className="bg-card text-card-foreground rounded-xl border p-6 shadow-sm overflow-hidden flex items-center relative">
      <div className="flex items-center gap-4 w-full z-10 shrink-0">
        {lastReadBook.coverUrl && (
          <div className="relative shrink-0">
            <Image
              src={lastReadBook.coverUrl}
              alt="book"
              width={192}
              height={320}
              className="h-40 scale-150 w-auto rounded-md blur-xl absolute -z-10"
              aria-hidden
            />
            <Image
              src={lastReadBook.coverUrl}
              alt="book"
              width={192}
              height={320}
              className="h-40 w-auto rounded-md shrink-0"
            />
          </div>
        )}
        <div className="flex flex-col">
          <div className="text-sm text-muted-foreground">
            Вы остановились на
          </div>
          <div className="text-2xl font-bold">{pages} странице</div>
          <div className="text-muted-foreground">
            В книге {lastReadBook.title} - {lastReadBook.author}
          </div>
        </div>
        <Button variant="outline" asChild className="ml-auto absolute top-4 right-4">
          <Link href={`/books?bookId=${lastReadBook.id}`}>
            <div className="hidden sm:block">Открыть</div>
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
