import { Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";

export default function BookTagNotFound() {
  return (
    <main className="mx-auto max-w-2xl p-2 sm:pt-6">
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Tag aria-hidden="true" />
          </EmptyMedia>
          <h1 className="text-xl font-semibold">Коллекция недоступна</h1>
          <EmptyDescription>
            Возможно, коллекция удалена или у вас нет к ней доступа.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" asChild>
            <Link href="/books">К книгам</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  );
}
