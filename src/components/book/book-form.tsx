"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UploadButton } from "@/components/uploadthing"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Trash } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { DrawerDialog } from "../ui/drawer-dialog"
import { DialogHeader, DialogTitle } from "../ui/dialog"
import { Loader } from "../ui/loader"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createBook } from "@/lib/actions/books"

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  pages: z.coerce.number().min(1),
  description: z.string().optional(),
  coverUrl: z.string().optional(),
})

export function BookForm({ onSuccess }: { onSuccess?: () => void }) {
  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
  })
  const [search, setSearch] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<
    {
      title: string
      authors: string
      imageUrl: string | null
    }[]
  >()
  const [fileUploading, setFileUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(values: z.infer<typeof bookSchema>) {
    setLoading(true)
    await createBook(values)
    setLoading(false)
    router.refresh()
    form.reset({
      title: "",
      author: "",
      pages: NaN,
      coverUrl: "",
      description: "",
    })
    if (onSuccess) onSuccess()
  }

  function searchClick() {
    setSearchLoading(true)
    fetch(`/api/labirintSearch?q=${encodeURIComponent(search)}`)
      .then((res) => res.json())
      .then((res) => {
        setSearchLoading(false)
        setSearchResults(res)
      })
  }

  return (
    <>
      <div className="mb-2 flex flex-col gap-2">
        {/* <form
          onSubmit={(evt) => {
            evt.preventDefault();
            searchClick();
          }}
        >
          <div className="flex gap-2">
            <Input
              className="w-full"
              value={search}
              onChange={(evt) => setSearch(evt.target.value)}
              placeholder="Поиск"
            />
            <Button size="icon" disabled={search.length === 0} type="submit">
              {searchLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form> */}
        <div className="flex gap-2 md:grid md:grid-cols-2 lg:grid-cols-4">
          {searchResults &&
            searchResults.slice(0, 5).map((book) => (
              <button
                key={book.title}
                className="flex gap-2 rounded-xl border p-3"
                onClick={() => {
                  form.reset({
                    title: book.title,
                    author: book.authors,
                    coverUrl: book.imageUrl ?? undefined,
                  })
                  setSearchResults(undefined)
                }}
              >
                {book.imageUrl && (
                  <Image
                    src={book.imageUrl}
                    width={500}
                    height={500}
                    className="h-auto w-[20vw] rounded-md md:w-[15vw] lg:w-[10vw]"
                    alt="cover"
                  />
                )}
                <div className="flex flex-col">
                  <div className="text-xl">{book.title}</div>
                  <div className="w-fit text-xs text-black/70">
                    {book.authors}
                  </div>
                </div>
              </button>
            ))}
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="coverUrl"
            render={({ field }) => (
              <FormItem>
                {field.value ? (
                  <div className="relative w-fit">
                    <Image
                      src={field.value}
                      width={500}
                      height={500}
                      className="h-52 w-auto rounded-md"
                      alt="cover"
                    />
                    <div className="absolute right-0 top-2 flex translate-x-1/2 flex-col gap-2">
                      <Button
                        size="icon"
                        className="size-fit p-1"
                        variant="outline"
                        onClick={() => field.onChange("")}
                        type="button"
                      >
                        <Trash className="size-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UploadButton
                      endpoint="bookCover"
                      content={{
                        button: "Обложка",
                        allowedContent: "Картинка (до 8МБ)",
                      }}
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].url)
                        setFileUploading(false)
                      }}
                      onUploadError={(error: Error) => {
                        toast.error("Ошибка при загрузке обложки", {
                          description: error.message,
                        })
                      }}
                      onUploadBegin={(fileName) => {
                        setFileUploading(true)
                      }}
                      appearance={{
                        allowedContent: "text-black/70 dark:text-white/70",
                      }}
                    />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Автор</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Кол-во страниц</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Описание</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading || fileUploading}>
            {loading ? (
              <Loader invert className="mr-2 size-4" />
            ) : (
              <Plus className="mr-2 size-4" />
            )}
            Создать
          </Button>
        </form>
      </Form>
    </>
  )
}

export function MobileForm() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <div className="m-2 flex items-center">
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 size-4" /> Добавить книгу
        </Button>
      </div>
      <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
        <DialogHeader>
          <DialogTitle>Добавить книгу</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <BookForm
            onSuccess={() => {
              setOpen(false)
            }}
          />
        </div>
      </DrawerDialog>
    </>
  )
}
