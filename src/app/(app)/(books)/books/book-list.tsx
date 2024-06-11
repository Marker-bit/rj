"use client"

import { MobileForm } from "@/components/book/book-form"
import { BookView } from "@/components/book/book-view"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Book } from "@/lib/api-types"
import { BookMinus, Search } from "lucide-react"
import { useEffect, useState } from "react"
import Fuse from "fuse.js"
import { BackgroundColor } from "@prisma/client"

export function BookList({ books }: { books: Book[] }) {
  const [readBooks, setReadBooks] = useState(false)
  const [notStarted, setNotStarted] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [searchResults, setSearchResults] = useState<Book[]>()

  useEffect(() => {
    const localStorageReadBooks = localStorage.getItem("readBooks")
    const localStorageNotStarted = localStorage.getItem("notStarted")
    if (localStorageReadBooks) {
      setReadBooks(JSON.parse(localStorageReadBooks))
    }
    if (localStorageNotStarted) {
      setNotStarted(JSON.parse(localStorageNotStarted))
    }
  }, [])

  function changeReadBooks() {
    setReadBooks((readBooks) => {
      localStorage.setItem("readBooks", JSON.stringify(!readBooks))
      return !readBooks
    })
  }
  function changeNotStarted() {
    setNotStarted((notStarted) => {
      localStorage.setItem("notStarted", JSON.stringify(!notStarted))
      return !notStarted
    })
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
      <MobileForm />
      <div className="flex flex-col gap-2 p-3">
        <div
          className="mb-2 flex cursor-pointer select-none items-center space-x-2 rounded-md border p-2 transition-all hover:bg-neutral-100 dark:hover:bg-neutral-900"
          onClick={changeReadBooks}
        >
          <Switch id="readBooks" checked={readBooks} />
          <div
            className="cursor-pointer select-none text-sm font-medium leading-none peer-disabled:opacity-70"
            onClick={changeReadBooks}
          >
            Скрывать прочитанные книги
          </div>
        </div>
        <div
          className="mb-2 flex cursor-pointer select-none items-center space-x-2 rounded-md border p-2 transition-all hover:bg-neutral-100 dark:hover:bg-neutral-900"
          onClick={changeNotStarted}
        >
          <Switch id="notStarted" checked={notStarted} />
          <div
            className="cursor-pointer select-none text-sm font-medium leading-none peer-disabled:opacity-70"
            onClick={changeNotStarted}
          >
            Скрывать не начатые книги
          </div>
        </div>
        {books.length === 0 && (
          <div className="flex items-center gap-2 rounded-xl border p-2 text-xl">
            <BookMinus className="size-10" />
            <div className="flex flex-col">
              <div>Нет книг</div>
            </div>
          </div>
        )}
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
