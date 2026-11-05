import { TrashIcon } from "lucide-react";
import { BookView } from "@/components/agent/book-view";
import type { ToolOutputView, ToolView } from "@/lib/ai/tools/types";

const DeleteBookView: ToolOutputView<"deleteBook"> = ({ output }) => {
  if (!output?.book) {
    return null;
  }

  return (
    <BookView
      title={output.book.title}
      author={output.book.author}
      pages={output.book.pages}
    />
  );
};

export const deleteBookToolView: ToolView<"deleteBook"> = {
  title: "Удалить книгу",
  texts: {
    loadingText: "Удаляет книгу...",
    successText: "Удалил книгу",
    approvalText: "Хочет удалить книгу",
    acceptedText: "Удаление книги принято",
    deniedText: "Удаление книги отклонено",
  },
  icon: TrashIcon,
  outputView: DeleteBookView,
};
