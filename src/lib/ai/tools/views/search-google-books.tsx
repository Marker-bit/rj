import { SearchIcon } from "lucide-react";
import { BookView } from "@/components/agent/book-view";
import type { ToolOutputView, ToolView } from "@/lib/ai/tools/types";
import { Spinner } from "@/components/ui/spinner";

const GoogleBooksView: ToolOutputView<"searchGoogleBooks"> = ({
  input,
  output,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center rounded-xl border">
        <SearchIcon className="size-4 text-muted-foreground" />
        {input.searchQuery}
      </div>
      <div className="flex flex-col gap-1">
        {!output ? (
          <div className="w-40 h-20 text-muted-foreground flex items-center justify-center rounded-md border">
            <Spinner />
          </div>
        ) : output.items?.length ? (
          output.items.map((book) => (
            <BookView
              key={book.id}
              title={book.volumeInfo?.title ?? "Нет названия"}
              author={
                book.volumeInfo?.authors
                  ? book.volumeInfo?.authors.join(", ")
                  : "Нет авторов"
              }
              pages={book.volumeInfo?.pageCount}
            />
          ))
        ) : (
          <div className="text-muted-foreground text-sm">Ничего не найдено</div>
        )}
      </div>
    </div>
  );
};

export const searchGoogleBooksToolView: ToolView<"searchGoogleBooks"> = {
  title: "Искать книги",
  texts: {
    loadingText: "Ищет книги...",
    successText: "Поискал книги",
    approvalText: "Хочет найти книги",
  },
  icon: SearchIcon,
  outputView: GoogleBooksView,
};
