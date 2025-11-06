import { toolSetForUser } from "@/lib/ai/tools/toolset";
import { ToolOutputView, ToolView } from "@/lib/ai/tools/types";
import { declOfNum } from "@/lib/utils";
import { InferToolInput, InferToolOutput } from "ai";
import { BookIcon, PlusIcon } from "lucide-react";

const CreateBookView: ToolOutputView<
  InferToolInput<ReturnType<typeof toolSetForUser>["createBook"]>,
  InferToolOutput<ReturnType<typeof toolSetForUser>["createBook"]>
> = ({ input, output }) => {
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

export const createBookToolView: ToolView<
  InferToolInput<ReturnType<typeof toolSetForUser>["createBook"]>,
  InferToolOutput<ReturnType<typeof toolSetForUser>["createBook"]>
> = {
  texts: {
    loadingText: "Создаёт книгу...",
    successText: "Создал книгу",
    approvalText: "Хочет создать книгу",
    deniedText: "Создание книги отклонено",
  },
  icon: PlusIcon,
  outputView: CreateBookView,
};
