import { useQuery } from "@tanstack/react-query";
import { CircleAlertIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { cn, declOfNum } from "@/lib/utils";
import { BackgroundColor } from "@prisma/client";
import { backgroundColors } from "@/lib/colors";
import Image from "next/image";

export function BookView({
  title,
  author,
  pages,
  collections,
  coverUrl,
  fields,
  background = BackgroundColor.NONE,
}: {
  title: string;
  author: string;
  pages?: number;
  collections?: string[];
  coverUrl?: string;
  background?: BackgroundColor;
  fields?: { title: string; value: string }[];
}) {
  const color =
    background !== BackgroundColor.NONE
      ? backgroundColors.find((bg) => bg.type === background)
      : null;

  return (
    <div
      className={cn(
        "flex min-w-0 items-start gap-2 rounded-md border px-2 pt-1 pb-2",
        background !== BackgroundColor.NONE && "outline-4 outline-solid",
        color?.outline,
      )}
    >
      {coverUrl && (
        <Image
          width={64}
          height={96}
          src={coverUrl}
          alt="cover"
          unoptimized={coverUrl.includes("books.google.com")}
          className="h-24 w-16 shrink-0 rounded-md object-cover"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col leading-tight">
        <h2 className="line-clamp-2 text-sm font-semibold break-words">
          {title}
        </h2>
        <div className="text-xs text-muted-foreground break-words">
          {author}
        </div>
        <div className="text-xs text-muted-foreground">
          {pages ? (
            <>
              {pages} {declOfNum(pages, ["страница", "страницы", "страниц"])}
            </>
          ) : (
            "Неизвестное кол-во страниц"
          )}
        </div>
        {collections && collections.length > 0 && (
          <div className="mt-1 flex min-w-0 flex-wrap gap-2">
            {collections.map((c) => (
              <Badge key={c} variant="outline" className="max-w-full truncate">
                {c}
              </Badge>
            ))}
          </div>
        )}
        {fields && fields.length > 0 && (
          <div className="mt-1 flex min-w-0 flex-wrap gap-1">
            {fields.map((field) => (
              <div
                key={field.title + field.value}
                className="max-w-full rounded-xl border px-2 py-1 text-xs break-words"
              >
                {field.title}: {field.value}
              </div>
            ))}
          </div>
        )}
      </div>
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
    <div className="flex min-w-0 flex-col rounded-md border px-2 pt-1 pb-2 leading-tight">
      <h2 className="text-sm font-semibold break-words">
        {bookQuery.data.title}
      </h2>
      <div className="text-xs text-muted-foreground break-words">
        {bookQuery.data.author}
      </div>
      <div className="text-xs text-muted-foreground">
        {bookQuery.data.pages}{" "}
        {declOfNum(bookQuery.data.pages, ["страница", "страницы", "страниц"])}
      </div>
    </div>
  );
}
