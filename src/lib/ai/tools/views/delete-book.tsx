import { RemoteBookView } from "@/components/agent/book-view";
import { Spinner } from "@/components/ui/spinner";
import { ToolOutputView, ToolView } from "@/lib/ai/tools/types";
import { declOfNum } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CircleAlertIcon, TrashIcon } from "lucide-react";

const DeleteBookView: ToolOutputView<"deleteBook"> = ({ input }) => {
  return <RemoteBookView bookId={input.id} />;
};

export const deleteBookToolView: ToolView<"deleteBook"> = {
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
