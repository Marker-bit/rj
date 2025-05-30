"use client"

import { BookView } from "@/components/book/book-view"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Book } from "@/lib/api-types"
import { BookMinus, Search } from "lucide-react"
import { useEffect, useState } from "react"
import Fuse from "fuse.js"
import { BackgroundColor } from "@prisma/client"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function BookList({ books }: { books: Book[] }) {
  const [readBooks, _setReadBooks] = useState(false)
  const [notStarted, _setNotStarted] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [searchResults, setSearchResults] = useState<Book[]>()

  useEffect(() => {
    const localStorageReadBooks = localStorage.getItem("readBooks")
    const localStorageNotStarted = localStorage.getItem("notStarted")
    if (localStorageReadBooks) {
      _setReadBooks(JSON.parse(localStorageReadBooks))
    }
    if (localStorageNotStarted) {
      _setNotStarted(JSON.parse(localStorageNotStarted))
    }
  }, [])

  function setReadBooks(value: boolean) {
    localStorage.setItem("readBooks", JSON.stringify(value))
    _setReadBooks(value)
  }
  function setNotStarted(value: boolean) {
    localStorage.setItem("notStarted", JSON.stringify(value))
    _setNotStarted(value)
  }

  let filteredBooks = books

  if (readBooks) {
    filteredBooks = filteredBooks.filter((book: Book) => {
      if (book.readEvents.length === 0) {
        return true
      }
      return !(book.pages === book.readEvents[0].pagesRead)
    })
  }

  if (notStarted) {
    filteredBooks = filteredBooks.filter((book: Book) => {
      return book.readEvents.length !== 0
    })
  }

  const fuse = new Fuse(filteredBooks, {
    keys: ["title", "author"],
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function search(evt?: any) {
    if (searchText === "") {
      setSearchResults(undefined)
      return
    }
    setSearchResults(fuse.search(searchText).map((result) => result.item))
    if (evt !== undefined) {
      evt.preventDefault()
    }
  }

  useEffect(() => {
    search()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, books, readBooks, notStarted])

  const outlinedBooks = filteredBooks.filter(
    (book: Book) => book.background !== BackgroundColor.NONE
  )

  const notOutlinedBooks = filteredBooks.filter(
    (book: Book) => book.background === BackgroundColor.NONE
  )

  return (
    <div>
      <div className="flex flex-col gap-2 p-3">
        <div className="grid md:grid-cols-2 gap-2">
          <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
            <Checkbox
              id="readBooks"
              aria-describedby="readBooks-description"
              checked={readBooks}
              onCheckedChange={setReadBooks}
            />
            <div className="grid grow gap-2">
              <Label htmlFor="readBooks">
                Скрывать прочитанные книги
              </Label>
              <p id="readBooks-description" className="text-muted-foreground text-xs">
                Включите, чтобы прочитанные вами книги не отображались в списке.
              </p>
            </div>
          </div>
          <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
            <Checkbox
              id="notStarted"
              aria-describedby="notStarted-description"
              checked={notStarted}
              onCheckedChange={setNotStarted}
            />
            <div className="grid grow gap-2">
              <Label htmlFor="notStarted">
                Скрывать не начатые книги
              </Label>
              <p id="notStarted-description" className="text-muted-foreground text-xs">
                Включите, чтобы книги без прочитанных страниц не отображались в списке.
              </p>
            </div>
          </div>
        </div>
        <form className="flex gap-2" onSubmit={search}>
          <Input
            placeholder="Поиск"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button size="icon" type="submit">
            <Search className="size-4" />
          </Button>
        </form>
        {searchResults && (
          <Button
            variant="outline"
            onClick={() => {
              setSearchResults(undefined)
              setSearchText("")
            }}
            className="md:w-fit"
          >
            Сбросить поиск
          </Button>
        )}
        {books.length === 0 && (
          <div className="flex items-center gap-2 rounded-xl border p-2 text-xl">
            <BookMinus className="size-10" />
            <div className="flex flex-col">
              <div>Нет книг</div>
            </div>
          </div>
        )}
        {searchResults ? (
          searchResults.map((book: Book) => (
            <BookView book={book} key={book.id} />
          ))
        ) : (
          <>
            {outlinedBooks.map((book: Book) => (
              <BookView key={book.id} book={book} />
            ))}
            {notOutlinedBooks.map((book: Book) => (
              <BookView key={book.id} book={book} />
            ))}
          </>
        )}
        {/* {(searchResults || filteredBooks).map((book: Book) => (
          <BookView book={book} key={book.id} />
        ))} */}
      </div>
    </div>
  )
}
