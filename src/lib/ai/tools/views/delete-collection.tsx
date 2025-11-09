import { RemoteBookView } from "@/components/agent/book-view";
import { Spinner } from "@/components/ui/spinner";
import { ToolOutputView, ToolView } from "@/lib/ai/tools/types";
import { useQuery } from "@tanstack/react-query";
import { CircleAlertIcon, TrashIcon } from "lucide-react";

const DeleteCollectionView: ToolOutputView<"deleteCollection"> = ({
  input,
}) => {
  const collectionQuery = useQuery({
    queryKey: ["collection", input.id],
    queryFn: () =>
      fetch(`/api/collections/${input.id}`).then((res) => {
        if (!res.ok) {
          throw new Error("Не удалось получить коллекцию");
        }
        return res.json();
      }),
  });
  return collectionQuery.isLoading ? (
    <div className="w-40 h-20 text-muted-foreground flex items-center justify-center rounded-md border">
      <Spinner />
    </div>
  ) : collectionQuery.isError ? (
    <div className="w-40 h-20 text-muted-foreground flex items-center justify-center rounded-md border">
      <CircleAlertIcon />
    </div>
  ) : (
    <div className="px-2 pt-1 pb-2 rounded-md flex flex-col leading-tight border">
      <h2 className="text-sm font-semibold">{collectionQuery.data.name}</h2>
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
