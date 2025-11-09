import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { declOfNum } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CircleAlertIcon } from "lucide-react";

export function BookView({
  title,
  author,
  pages,
  collections,
}: {
  title: string;
  author: string;
  pages: number;
  collections?: string[];
}) {
  return (
    <div className="px-2 pt-1 pb-2 rounded-md flex flex-col leading-tight border">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="text-xs text-muted-foreground">{author}</div>
      <div className="text-xs text-muted-foreground">
        {pages} {declOfNum(pages, ["страница", "страницы", "страниц"])}
      </div>
      {collections && collections.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {collections.map((c) => (
            <Badge key={c} variant="outline">
              {c}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export function RemoteBookView({ bookId }: { bookId: string }) {
  const bookQuery = useQuery({
    queryKey: ["book", bookId],
    queryFn: () =>
      fetch(`/api/books/${bookId}`).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch book");
        }
        return res.json();
      }),
  });

  return bookQuery.isLoading ? (
    <div className="w-40 h-20 text-muted-foreground flex items-center justify-center rounded-md border">
      <Spinner />
    </div>
  ) : bookQuery.isError ? (
    <div className="w-40 h-20 text-muted-foreground flex items-center justify-center rounded-md border">
      <CircleAlertIcon />
    </div>
  ) : (
    <div className="px-2 pt-1 pb-2 rounded-md flex flex-col leading-tight border">
      <h2 className="text-sm font-semibold">{bookQuery.data.title}</h2>
      <div className="text-xs text-muted-foreground">
        {bookQuery.data.author}
      </div>
      <div className="text-xs text-muted-foreground">
        {bookQuery.data.pages}{" "}
        {declOfNum(bookQuery.data.pages, ["страница", "страницы", "страниц"])}
      </div>
    </div>
  );
}
