import { CircleAlertIcon, ListPlusIcon, UndoIcon } from "lucide-react";
import { RemoteBookView } from "@/components/agent/book-view";
import type { ToolOutputView, ToolView } from "@/lib/ai/tools/types";
import { dateToString } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";

const UndoBookEventView: ToolOutputView<"undoBookEvent"> = ({ input }) => {
  const bookQuery = useQuery({
    queryKey: ["book", input.id],
    queryFn: () =>
      fetch(`/api/books/${input.id}`).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch book");
        }
        return res.json();
      }),
  });

  const readEvent = bookQuery.isSuccess
    ? bookQuery.data.readEvents.find((evt: any) => evt.id === input.eventId)
    : null;

  return bookQuery.isLoading ? (
    <div className="w-40 h-20 text-muted-foreground flex items-center justify-center rounded-md border">
      <Spinner />
    </div>
  ) : bookQuery.isError ? (
    <div className="w-40 h-20 text-muted-foreground flex items-center justify-center rounded-md border">
      <CircleAlertIcon />
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      <RemoteBookView bookId={input.id} />
      {readEvent && (
        <div>
          Событие о прочтении до {readEvent.pagesRead}-ой страницы{" "}
          {dateToString(new Date(readEvent.readAt), true)}
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
