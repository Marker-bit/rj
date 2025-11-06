import { toolSetForUser } from "@/lib/ai/tools/toolset";
import { ToolOutputView, ToolView } from "@/lib/ai/tools/types";
import { declOfNum } from "@/lib/utils";
import { InferToolInput, InferToolOutput } from "ai";
import { BookIcon } from "lucide-react";

const BookOutputView: ToolOutputView<
  InferToolInput<ReturnType<typeof toolSetForUser>["getAllBooks"]>,
  InferToolOutput<ReturnType<typeof toolSetForUser>["getAllBooks"]>
> = ({ input, output }) => {
  const showedBooks = output.slice(0, 3);
  const leftBooks = Math.max(0, output.length - showedBooks.length);

  return (
    <div>
      <div className="flex flex-col gap-1">
        {showedBooks.map((book) => (
          <div
            className="px-2 pt-1 pb-2 rounded-md flex flex-col leading-tight border"
            key={book.id}
          >
            <h2 className="text-sm font-semibold">{book.title}</h2>
            <div className="text-xs text-muted-foreground">{book.author}</div>
            <div className="text-xs text-muted-foreground">
              {book.pages}{" "}
              {declOfNum(book.pages, ["страница", "страницы", "страниц"])}
            </div>
          </div>
        ))}
        {leftBooks > 0 && (
          <div className="text-muted-foreground text-xs font-medium">
            и ещё {leftBooks} {declOfNum(leftBooks, ["книга", "книги", "книг"])}
          </div>
        )}
      </div>
    </div>
  );
};

export const getAllBooksToolView: ToolView<
  InferToolInput<ReturnType<typeof toolSetForUser>["getAllBooks"]>,
  InferToolOutput<ReturnType<typeof toolSetForUser>["getAllBooks"]>
> = {
  texts: {
    loadingText: "Просматривает книги...",
    successText: "Просмотрел книги",
    approvalText: "Хочет просмотреть книги",
  },
  icon: BookIcon,
  outputView: BookOutputView,
};
