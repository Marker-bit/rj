import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLastReadBook } from "@/lib/books";
import { validateRequest } from "@/lib/server-validate-request";
import { ReadButton } from "./read-button";

export default async function LastReadCard() {
  const { user } = await validateRequest();
  if (!user) return null;
  const data = await getLastReadBook(user.id);
  if (!data) return null;

  const { book: lastReadBook, pages } = data;

  return (
    <div className="bg-card text-card-foreground relative flex items-center gap-4 overflow-hidden rounded-2xl border p-6 shadow-sm">
      {lastReadBook.coverUrl && (
        <Image
          src={lastReadBook.coverUrl}
          alt={`Обложка книги «${lastReadBook.title}»`}
          width={192}
          height={320}
          className="h-40 w-auto shrink-0 rounded-md object-cover shadow-md ring-1 ring-foreground/10"
        />
      )}
      <div className="flex min-w-0 flex-col items-start">
        <div className="text-sm text-muted-foreground">Вы остановились на</div>
        <div className="text-2xl font-bold">{pages} странице</div>
        <div className="text-muted-foreground text-pretty">
          В книге {lastReadBook.title} — {lastReadBook.author}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <ReadButton book={lastReadBook} />
          <Button variant="outline" asChild>
            <Link href={`/books/${lastReadBook.id}`}>
              <div className="hidden sm:block">Открыть</div>
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
