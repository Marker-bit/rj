import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { SearchX } from "lucide-react";

export default function AppNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX />
          </EmptyMedia>
          <EmptyTitle>Страница не найдена</EmptyTitle>
          <EmptyDescription>
            Возможно, запись удалена или у вас нет к ней доступа.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex flex-wrap justify-center gap-2">
          <Button asChild>
            <Link href="/home">На главную</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/books">К книгам</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/groups">К группам</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
