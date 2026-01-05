import { PlusIcon } from "lucide-react";
import { BookView } from "@/components/agent/book-view";
import type { ToolOutputView, ToolView } from "@/lib/ai/tools/types";

const CreateBookView: ToolOutputView<"createBook"> = ({ input, output }) => {
  return (
    <BookView title={input.title} author={input.author} pages={input.pages} />
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
