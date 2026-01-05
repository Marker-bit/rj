import type { Book, Group, GroupBook } from "@prisma/client";
import type { User } from "lucia";
import { BookIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AddBookButton } from "../../add-book-button";
import { GroupBookView } from "../../book-view";

export default function BooksSection({
  isMember,
  group,
  user,
}: {
  isMember: boolean;
  group: {
    id: string;
    groupBooks: (GroupBook & {
      group: Group;
      book: (Book & { readEvents: { pagesRead: number }[] })[];
    })[];
  };
  myBooksFromGroup: {
    groupBookId: string;
  }[];
  user: User;
}) {
  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center gap-1 text-sm text-black/70 dark:text-white/70">
        <BookIcon className="size-4" />
        <div>Книги</div>
        {!isMember && <AddBookButton groupId={group.id} />}
      </div>
      <ScrollArea className="h-[40vh]">
        {group.groupBooks.map((book) => (
          <GroupBookView groupBook={book} key={book.id} userId={user.id} />
        ))}
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
