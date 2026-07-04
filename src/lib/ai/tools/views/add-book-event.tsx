import { ListPlusIcon } from "lucide-react";
import { RemoteBookView } from "@/components/agent/book-view";
import type { ToolOutputView, ToolView } from "@/lib/ai/tools/types";
import { dateToString } from "@/lib/utils";

const AddBookEventView: ToolOutputView<"addBookEvent"> = ({ input }) => {
  return (
    <div className="flex flex-col gap-2">
      <RemoteBookView bookId={input.id} />
      <div>
        прочитана до {input.pagesRead}-ой страницы{" "}
        {dateToString(new Date(input.dateRead), true)}
      </div>
    </div>
  );
};

export const addBookEventToolView: ToolView<"addBookEvent"> = {
  title: "Добавить событие",
  texts: {
    loadingText: "Добавляет событие...",
    successText: "Добавил событие",
    approvalText: "Хочет добавить событие",
    acceptedText: "Добавление события принято",
    deniedText: "Добавление события отклонено",
  },
  icon: ListPlusIcon,
  outputView: AddBookEventView,
};
