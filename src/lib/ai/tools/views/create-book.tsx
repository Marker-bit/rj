import { PlusIcon } from "lucide-react";
import { BookView } from "@/components/agent/book-view";
import type { ToolOutputView, ToolView } from "@/lib/ai/tools/types";

const CreateBookView: ToolOutputView<"createBook"> = ({ input, output }) => {
  const book = output?.book;

  return (
    <BookView
      coverUrl={book?.coverUrl ?? input.coverUrl}
      background={input.background}
      title={book?.title ?? input.title}
      author={book?.author ?? input.author}
      pages={book?.pages ?? input.pages}
      fields={input.fields}
    />
  );
};

export const createBookToolView: ToolView<"createBook"> = {
  title: "Создать книгу",
  texts: {
    loadingText: "Создаёт книгу...",
    successText: "Создал книгу",
    approvalText: "Хочет создать книгу",
    acceptedText: "Создание книги принято",
    deniedText: "Создание книги отклонено",
  },
  icon: PlusIcon,
  outputView: CreateBookView,
};
