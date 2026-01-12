import { ChevronDown } from "lucide-react";
import { BookView } from "@/components/book/book-view";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Book } from "@/lib/api-types";

export default function HiddenBooksCollapsible({
  hiddenBooks,
}: {
  hiddenBooks: Book[];
}) {
  return (
    <Collapsible>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">Скрытые</h2>
          <p className="mb-2 text-muted-foreground">Книги, которые вы скрыли</p>
        </div>
        <CollapsibleTrigger asChild className="group">
          <Button variant="ghost">
            <ChevronDown className="group-data-[state=open]:rotate-180 transition" />
            <span className="group-data-[state=open]:hidden">Больше</span>
            <span className="group-data-[state=closed]:hidden">Меньше</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="flex flex-col gap-2 mt-2">
        {hiddenBooks.map((b) => (
          <BookView key={b.id} book={b} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
