import { BookView } from "@/components/agent/book-view";
import { ToolOutputView, ToolView } from "@/lib/ai/tools/types";
import { declOfNum } from "@/lib/utils";
import { BookIcon, ListOrderedIcon } from "lucide-react";

const BookOutputView: ToolOutputView<"getAllBooks"> = ({ input, output }) => {
  const showedBooks = output.slice(0, 3);
  const leftBooks = Math.max(0, output.length - showedBooks.length);

  return (
    <div>
      <div className="flex flex-col gap-1">
        <div className="text-xs flex gap-2 items-center">
          <ListOrderedIcon className="size-[1lh]" />
          <div>
            Отсортировано по{" "}
            <span className="font-bold">
              {input.orderBy === "activity"
                ? "последней активности"
                : "проценту прочтения"}
            </span>
          </div>
        </div>
        {showedBooks.map((book) => (
          <BookView
            key={book.id}
            title={book.title}
            author={book.author}
            pages={book.pages}
            collections={book.collections.map((collection) => collection.name)}
          />
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

export const getAllBooksToolView: ToolView<"getAllBooks"> = {
  texts: {
    loadingText: "Просматривает книги...",
    successText: "Просмотрел книги",
    approvalText: "Хочет просмотреть книги",
  },
  icon: BookIcon,
  outputView: BookOutputView,
};
