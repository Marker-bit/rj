import { BookIcon } from "lucide-react";
import { BookView } from "@/components/agent/book-view";
import type { ToolOutputView, ToolView } from "@/lib/ai/tools/types";

const BookIdView: ToolOutputView<"getBookById"> = ({ input, output }) => {
  const book = output;
  if (!book) return null;

  return (
    <div>
      <BookView
        key={book.id}
        title={book.title}
        author={book.author}
        pages={book.pages}
        collections={book.collections.map((collection) => collection.name)}
      />
    </div>
  );
};

export const getBookByIdToolView: ToolView<"getBookById"> = {
  title: "Получить книгу",
  texts: {
    loadingText: "Получает книгу...",
    successText: "Получил книгу",
    approvalText: "Хочет получить книгу",
  },
  icon: BookIcon,
  outputView: BookIdView,
};
