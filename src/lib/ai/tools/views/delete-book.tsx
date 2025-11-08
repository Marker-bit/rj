import { Spinner } from "@/components/ui/spinner";
import { toolSetForUser } from "@/lib/ai/tools/toolset";
import { ToolOutputView, ToolView } from "@/lib/ai/tools/types";
import { declOfNum } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { InferToolInput, InferToolOutput } from "ai";
import { CircleAlertIcon, TrashIcon } from "lucide-react";

const DeleteBookView: ToolOutputView<
  InferToolInput<ReturnType<typeof toolSetForUser>["deleteBook"]>,
  InferToolOutput<ReturnType<typeof toolSetForUser>["deleteBook"]>
> = ({ input }) => {
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

  return bookQuery.isLoading ? (
    <div className="w-40 h-20 text-muted-foreground flex items-center justify-center rounded-md border">
      <Spinner />
    </div>
  ) : bookQuery.isError ? (
    <div className="w-40 h-20 text-muted-foreground flex items-center justify-center rounded-md border">
      <CircleAlertIcon />
    </div>
  ) : (
    <div className="px-2 pt-1 pb-2 rounded-md flex flex-col leading-tight border">
      <h2 className="text-sm font-semibold">{bookQuery.data.title}</h2>
      <div className="text-xs text-muted-foreground">
        {bookQuery.data.author}
      </div>
      <div className="text-xs text-muted-foreground">
        {bookQuery.data.pages}{" "}
        {declOfNum(bookQuery.data.pages, ["страница", "страницы", "страниц"])}
      </div>
    </div>
  );
};

export const deleteBookToolView: ToolView<
  InferToolInput<ReturnType<typeof toolSetForUser>["deleteBook"]>,
  InferToolOutput<ReturnType<typeof toolSetForUser>["deleteBook"]>
> = {
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
