import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Book, GroupBook, GroupMember, GroupMemberRole } from "@prisma/client"
import { Text } from "lucide-react";

export default function ChangedInfo({
  book,
  member,
  currentMember,
  groupBook,
}: {
  book: Book
  member: GroupMember
  currentMember: GroupMember
  groupBook: GroupBook
}) {
  const pagesUpdated = book.pages !== groupBook.pages
  const canSeeDescription =
    currentMember.role !== GroupMemberRole.MEMBER ||
    currentMember.userId === member.userId
  return (
    <>
      {book?.description === groupBook.description ? null : (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-fit">
              <Text className="mr-2 size-4" />
              Описание
            </Button>
          </PopoverTrigger>
          <PopoverContent className="max-w-[400px] p-4">
            {canSeeDescription ? (
              book.description ? (
                book.description
              ) : (
                <p className="text-muted-foreground">Пустое описание</p>
              )
            ) : (
              <p className="text-muted-foreground">
                Вы не можете просмотреть чужое описание
              </p>
            )}
          </PopoverContent>
        </Popover>
      )}
      {pagesUpdated && (
        <div className="text-sm text-muted-foreground/70">
          {book.pages} стр. вместо {groupBook.pages}
        </div>
      )}
    </>
  )
}
