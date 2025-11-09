import { BookView } from "@/components/agent/book-view";
import { Badge } from "@/components/ui/badge";
import { ToolOutputView, ToolView } from "@/lib/ai/tools/types";
import { declOfNum } from "@/lib/utils";
import { BookIcon, LayersIcon, ListOrderedIcon } from "lucide-react";

const CollectionsOutputView: ToolOutputView<"getAllCollections"> = ({
  output,
}) => {
  const showedCollections = output.slice(0, 3);
  const leftCollections = Math.max(0, output.length - showedCollections.length);

  return (
    <div>
      <div className="flex flex-col gap-1">
        {showedCollections.map((collection) => (
          <div
            className="px-2 pt-1 pb-2 rounded-md flex flex-col leading-tight border"
            key={collection.id}
          >
            <h2 className="text-sm font-semibold">{collection.name}</h2>
            <Badge variant="outline">
              {collection.books.length}{" "}
              {declOfNum(collection.books.length, ["книга", "книги", "книг"])}
            </Badge>
          </div>
        ))}
        {leftCollections > 0 && (
          <div className="text-muted-foreground text-xs font-medium">
            и ещё {leftCollections}{" "}
            {declOfNum(leftCollections, [
              "коллекция",
              "коллекции",
              "коллекций",
            ])}
          </div>
        )}
      </div>
    </div>
  );
};

export const getAllCollectionsToolView: ToolView<"getAllCollections"> = {
  title: "Просмотреть коллекции",
  texts: {
    loadingText: "Просматривает коллекции...",
    successText: "Просмотрел коллекции",
    approvalText: "Хочет просмотреть коллекции",
  },
  icon: LayersIcon,
  outputView: CollectionsOutputView,
};
