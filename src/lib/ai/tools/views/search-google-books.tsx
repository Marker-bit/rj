import {
  BookOpenIcon,
  BuildingIcon,
  ChevronDownIcon,
  HashIcon,
  LucideIcon,
  SearchIcon,
  TagIcon,
  UserIcon,
} from "lucide-react";
import { BookView } from "@/components/agent/book-view";
import type { ToolOutputView, ToolView } from "@/lib/ai/tools/types";
import { Spinner } from "@/components/ui/spinner";
import { filterSchema } from "@/lib/apis/books";
import z from "zod";
import { Button } from "@/components/ui/button";

const filters: Record<
  keyof z.infer<typeof filterSchema>,
  { name: string; icon: LucideIcon }
> = {
  intitle: { name: "В заголовке", icon: BookOpenIcon },
  inauthor: { name: "Автор", icon: UserIcon },
  inpublisher: { name: "Издательство", icon: BuildingIcon },
  subject: { name: "Категория", icon: TagIcon },
  isbn: { name: "ISBN", icon: HashIcon },
  lccn: { name: "LCCN", icon: HashIcon },
  oclc: { name: "OCLC", icon: HashIcon },
};

const FilterView = ({
  filter,
}: {
  filter: string | z.infer<typeof filterSchema>;
}) => {
  if (typeof filter === "string") {
    return (
      <div className="flex gap-2 items-center rounded-xl border px-2 py-1 truncate">
        <SearchIcon className="size-4 text-muted-foreground" />
        {filter}
        <Button size="xs" className="ml-auto rounded-md px-1" variant="ghost">
          +1 <ChevronDownIcon data-icon="inline-end" />
        </Button>
      </div>
    );
  }

  const filterList = Object.entries(filter).map(([key, value]) => {
    const { name, icon: Icon } =
      filters[key as keyof z.infer<typeof filterSchema>];

    return (
      <div key={key} className="flex gap-2 items-center px-2 py-0.5 text-xs">
        <Icon className="size-3 text-muted-foreground" />
        <span className="text-muted-foreground font-semibold">{name}: </span>
        {value}
      </div>
    );
  });

  return (
    <div className="flex flex-col rounded-md border truncate divide-y">
      {filterList}
    </div>
  );
};

const GoogleBooksView: ToolOutputView<"searchGoogleBooks"> = ({
  input,
  output,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <FilterView filter={input.query} />
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
