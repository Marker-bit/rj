import { ToolOutputView, ToolView } from "@/lib/ai/tools/types";
import { declOfNum } from "@/lib/utils";
import { PlusIcon } from "lucide-react";

const CreateBookView: ToolOutputView<"createBook"> = ({ input, output }) => {
  return (
    <div>
      <div className="px-2 pt-1 pb-2 rounded-md flex flex-col leading-tight border">
        <h2 className="text-sm font-semibold">{input.title}</h2>
        <div className="text-xs text-muted-foreground">{input.author}</div>
        <div className="text-xs text-muted-foreground">
          {input.pages}{" "}
          {declOfNum(input.pages, ["страница", "страницы", "страниц"])}
        </div>
      </div>
    </div>
  );
};

export const createBookToolView: ToolView<"createBook"> = {
  texts: {
    loadingText: "Создаёт книгу...",
    successText: "Создал книгу",
    approvalText: "Хочет создать книгу",
    acceptedText: "Создание книги принято",
    deniedText: "Создание книги отклонено",
  },
  icon: PlusIcon,
  outputView: CreateBookView,
};
