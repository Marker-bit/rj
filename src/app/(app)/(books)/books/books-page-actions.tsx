"use client";

import { ArchiveIcon, ArrowRightIcon, HistoryIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import AddBookButton from "./button";

export function BooksPageActions() {
  return (
    <div className="flex gap-2">
      <AddBookButton />
      <SimpleTooltip
        className="max-w-45"
        text="Здесь хранятся все ваши прочитанные книги"
      >
        <Button className="group" variant="secondary" asChild>
          <Link href="/books/history">
            <HistoryIcon className="opacity-60" size={16} aria-hidden="true" />
            История
            <ArrowRightIcon
              className="opacity-60 transition-transform group-hover:translate-x-0.5"
              size={16}
              aria-hidden="true"
            />
          </Link>
        </Button>
      </SimpleTooltip>
      <SimpleTooltip
        className="max-w-45"
        text="Здесь хранятся все ваши архивированные книги"
      >
        <Button className="group" variant="secondary" asChild>
          <Link href="/books/archive">
            <ArchiveIcon className="opacity-60" size={16} aria-hidden="true" />
            Архив
            <ArrowRightIcon
              className="opacity-60 transition-transform group-hover:translate-x-0.5"
              size={16}
              aria-hidden="true"
            />
          </Link>
        </Button>
      </SimpleTooltip>
    </div>
  );
}
