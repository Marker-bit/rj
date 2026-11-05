import { TrashIcon } from "lucide-react";
import type { ToolOutputView, ToolView } from "@/lib/ai/tools/types";

const DeleteCollectionView: ToolOutputView<"deleteCollection"> = ({
  output,
}) => {
  if (!output?.collection) {
    return null;
  }

  return (
    <div className="px-2 pt-1 pb-2 rounded-md flex flex-col leading-tight border">
      <h2 className="text-sm font-semibold">{output.collection.name}</h2>
      <div className="text-xs text-muted-foreground">
        Книг: {output.collection.books.length}
      </div>
    </div>
  );
};

export const deleteCollectionToolView: ToolView<"deleteCollection"> = {
  title: "Удалить коллекцию",
  texts: {
    loadingText: "Удаляет коллекцию...",
    successText: "Удалил коллекцию",
    approvalText: "Хочет удалить коллекцию",
    acceptedText: "Удаление коллекции принято",
    deniedText: "Удаление коллекции отклонено",
  },
  icon: TrashIcon,
  outputView: DeleteCollectionView,
};
