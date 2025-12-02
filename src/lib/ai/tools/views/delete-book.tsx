import { RemoteBookView } from "@/components/agent/book-view";
import { ToolOutputView, ToolView } from "@/lib/ai/tools/types";
import { TrashIcon } from "lucide-react";

const DeleteBookView: ToolOutputView<"deleteBook"> = ({ input }) => {
  return <RemoteBookView bookId={input.id} />;
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
