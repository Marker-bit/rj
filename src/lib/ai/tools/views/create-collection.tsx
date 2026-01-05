import { SquareStackIcon } from "lucide-react";
import { RemoteBookView } from "@/components/agent/book-view";
import type { ToolOutputView, ToolView } from "@/lib/ai/tools/types";
import { declOfNum } from "@/lib/utils";

const CreateCollectionView: ToolOutputView<"createCollection"> = ({
  input,
}) => {
  if (!input.bookIds)
    return (
      <div className="px-2 pt-1 pb-2 rounded-md flex flex-col leading-tight border">
        <h2 className="text-sm font-semibold">{input.name}</h2>
        <div className="text-xs text-muted-foreground">Нет книг</div>
      </div>
    );
  const showedBooks = input.bookIds.slice(0, 3);
  const leftBooks = Math.max(0, input.bookIds.length - showedBooks.length);

  return (
    <div>
      <h2 className="text-sm font-semibold mb-2">{input.name}</h2>
      <div className="flex flex-col gap-1">
        {showedBooks.map((bookId) => (
          <RemoteBookView key={bookId} bookId={bookId} />
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

export const createCollectionToolView: ToolView<"createCollection"> = {
  title: "Создать коллекцию",
  texts: {
    loadingText: "Создаёт коллекцию...",
    successText: "Создал коллекцию",
    approvalText: "Хочет создать коллекцию",
    acceptedText: "Создание коллекции принято",
    deniedText: "Создание коллекции отклонено",
  },
  icon: SquareStackIcon,
  outputView: CreateCollectionView,
};
