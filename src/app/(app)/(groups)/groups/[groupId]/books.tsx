"use client"

import { BookIcon, Search } from "lucide-react"
import { AddBookButton } from "./add-book-button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { GroupBookView } from "./book-view"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import Fuse from "fuse.js"
import { ExportBooksButton } from "./export-books-button"
import { BookSuggestions } from "./book-suggestions"
import {
  GroupBookSuggestion,
  GroupMember,
  GroupMemberRole,
} from "@prisma/client"

export default function Books({
  isMember,
  group,
  userId,
}: {
  isMember: boolean
  group: {
    id: string
    groupBooks: any[]
    suggestions: GroupBookSuggestion[]
    members: GroupMember[]
  }
  userId: string
}) {
  const [searchText, setSearchText] = useState("")
  const [filteredBooks, setFilteredBooks] = useState<any[]>()
  const search = new Fuse(group.groupBooks, {
    keys: ["title", "author", "description"],
  })

  useEffect(() => {
    if (searchText) {
      const res = search.search(searchText)
      setFilteredBooks(res.map((result) => result.item))
    } else {
      setFilteredBooks(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, group.groupBooks])

  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center gap-1 text-sm text-black/70 dark:text-white/70">
        <BookIcon className="size-4" />
        <div>Книги</div>
        <div className="ml-auto flex items-center gap-1">
          {!isMember && <AddBookButton groupId={group.id} />}
          <ExportBooksButton books={group.groupBooks} />
          <BookSuggestions
            suggestions={group.suggestions}
            member={group.members.find((member) => member.userId === userId)!}
          />
        </div>
      </div>
      <div className="mt-2 flex gap-2">
        <Input
          placeholder="Поиск..."
          className="w-full"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button variant="outline" size="icon">
          <Search className="size-4" />
        </Button>
      </div>
      <ScrollArea className="h-[40vh]">
        {(filteredBooks || group.groupBooks).map((book) => (
          <GroupBookView groupBook={book} key={book.id} userId={userId} />
        ))}
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
