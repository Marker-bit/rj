import { UndoIcon } from "lucide-react";
import { RemoteBookView } from "@/components/agent/book-view";
import type { ToolOutputView, ToolView } from "@/lib/ai/tools/types";
import { dateToString } from "@/lib/date";

const UndoBookEventView: ToolOutputView<"undoBookEvent"> = ({
  input,
  output,
}) => {
  const event = output?.event;

  return (
    <div className="flex flex-col gap-2">
      <RemoteBookView bookId={input.id} />
      {event && (
        <div>
          Событие о прочтении до {event.pagesRead}-ой страницы{" "}
          {dateToString(new Date(event.readAt), true)}
        </div>
      )}
    </div>
  );
};

export const undoBookEventToolView: ToolView<"undoBookEvent"> = {
  title: "Отменить событие",
  texts: {
    loadingText: "Отменяет событие...",
    successText: "Отменил событие",
    approvalText: "Хочет отменить событие",
    acceptedText: "Отмена события принята",
    deniedText: "Отмена события отклонена",
  },
  icon: UndoIcon,
  outputView: UndoBookEventView,
};
