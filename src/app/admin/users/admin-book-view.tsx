import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { dateToString, declOfNum } from "@/lib/utils";
import { Book } from "@prisma/client";
import Image from "next/image";

export default function AdminBookView({ book }: { book: Book }) {
  return (
    <HoverCard>
      <HoverCardTrigger className="flex flex-col gap-2 rounded-md border p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {book.coverUrl && (
              <Image
                src={book.coverUrl}
                alt={book.title}
                width={64}
                height={64}
                className="size-12 rounded-md"
              />
            )}
            <div className="flex flex-col">
              <h3 className="text-sm font-medium">{book.title}</h3>
              <p className="text-xs text-muted-foreground">{book.author}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {book.pages} {declOfNum(book.pages, ["стр.", "стр.", "стр."])}
          </p>
        </div>
      </HoverCardTrigger>
      <HoverCardContent side="left" className="w-[320px]">
        <div className="space-y-3">
          <div className="space-y-1">
            <h2 className="font-semibold">
              {book.title}
              {book.description && " - " + book.author}
            </h2>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {book.description || book.author}
            </p>
          </div>
          
          {book.fields.length !== 0 && (
            <ul className="grid gap-3 text-xs">
              {book.fields.map((field) => (
                <li className="grid gap-0.5" key={field.title + field.value}>
                  <span className="text-muted-foreground">{field.title}</span>
                  <span className="font-medium">{field.value}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <span>Создана {dateToString(book.createdAt)}</span>
            {/* <span>·</span>
            <span></span> */}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
