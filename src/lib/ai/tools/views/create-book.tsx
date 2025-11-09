import { BookView } from "@/components/agent/book-view";
import { ToolOutputView, ToolView } from "@/lib/ai/tools/types";
import { PlusIcon } from "lucide-react";

const CreateBookView: ToolOutputView<"createBook"> = ({ input, output }) => {
  return (
    <BookView title={input.title} author={input.author} pages={input.pages} />
  );
};

export const createBookToolView: ToolView<"createBook"> = {
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
