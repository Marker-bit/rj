import { DateDoneModal } from "@/components/dialogs/books/read/date-done-modal";
import { DateReadModal } from "@/components/dialogs/books/read/date-read-modal";
import { Action } from "@/lib/books/actions/types";
import { Book } from "@prisma/client";
import { BookOpenCheckIcon, BookOpenTextIcon, InfoIcon } from "lucide-react";

type ExtendedAction = Action & {
  hidden: ((book: Book) => boolean | Promise<boolean>) | boolean;
};

export function getActions(book: Book): Action[] {
  return [
    {
      id: "mark-read",
      label: "Прочитана",
      icon: BookOpenCheckIcon,
      onClick: { type: "dialog", dialog: DateDoneModal },
      helpText: "Отметить книгу прочитанной в определённую дату",
      hidden: (book: Book) => {
        const lastEvent = await getLastEvent(book.id);
        return lastEvent?.pagesRead === book.pages;
      },
    },
    {
      id: "mark-progress",
      label: "Отметить прочтение",
      icon: BookOpenTextIcon,
      onClick: { type: "dialog", dialog: DateReadModal },
      helpText:
        "Отметить прочтение определённого количества страниц книги в некоторую дату",
      hidden: (book) => book.lastEvent?.pagesRead === book.pages,
    },
    {
      id: "share",
      label: "Поделиться",
      icon: Share,
      onClick: () => setShareBookOpen(true),
      helpText:
        "Создайте ссылки на книгу, чтобы другие могли скопировать её себе",
    },
    {
      id: "stats",
      label: "Статистика",
      icon: BarChart,
      onClick: () => setBookReadOpen(true),
      helpText: "Просмотреть статистику чтения книги",
      hidden: !history,
    },
    {
      id: "hide",
      label: book.isHidden ? "Показать" : "Скрыть",
      icon: book.isHidden ? Eye : EyeOff,
      onClick: () => hideMutation.mutate(),
      helpText: book.isHidden
        ? "Показать книгу в основном списке"
        : "Скрыть книгу для отложенного чтения",
      loading: hideMutation.isPending,
    },
  ];
}
