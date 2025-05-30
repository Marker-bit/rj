import { DrawerDialog } from "@/components/ui/drawer-dialog"
import { DialogHeader, DialogTitle } from "../../ui/dialog"
import { Edit, Loader, Plus, Trash, X } from "lucide-react"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { Button } from "../../ui/button"
import { UploadButton } from "../../uploadthing"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { Book } from "@prisma/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils";

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  pages: z.coerce.number().min(1),
  description: z.string().optional(),
  coverUrl: z.string().optional(),
  fields: z
    .array(
      z.object({
        title: z.string({ required_error: "Название поля обязательно" }),
        value: z.string({
          required_error: "Значение поля обязательно",
        }),
      })
    ),
})

export function EditBookModal({
  open,
  setOpen,
  book,
}: {
  open: boolean
  setOpen: (b: boolean) => void
  book: Book
}) {
  const queryClient = useQueryClient()

  const fieldsData =
    typeof book.fields === "string"
      ? JSON.parse(book.fields)
      : Array.isArray(book.fields)
      ? book.fields
      : []
  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book.title,
      author: book.author,
      pages: book.pages,
      description: book.description ?? "",
      coverUrl: book.coverUrl ?? "",
      fields: fieldsData ?? [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: "fields",
    control: form.control,
  })

  const router = useRouter()

  const editMutation = useMutation({
    mutationFn: (values: z.infer<typeof bookSchema>) =>
      fetch(`/api/books/${book.id}/`, {
        method: "PATCH",
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["books"],
      })
      queryClient.invalidateQueries({
        queryKey: ["events"],
      })
      router.refresh()
    },
  })

  async function onSubmit(values: z.infer<typeof bookSchema>) {
    await editMutation.mutateAsync(values)
    setOpen(false)
  }

  return (
    <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
      <DialogHeader className="mb-2">
        <DialogTitle className="flex items-center gap-2">
          <Edit className="size-4" /> Редактировать книгу
        </DialogTitle>
      </DialogHeader>
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
                      onClientUploadComplete={(res: any) => {
                        field.onChange(res[0].url)
                      }}
                      onUploadError={(error: Error) => {
                        alert(`ERROR! ${error.message}`)
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
          <div>
            {fields.map((field, index) => (
              <FormItem key={field.id}>
                <FormLabel className={cn(index !== 0 && "sr-only")}>
                  Поля
                </FormLabel>
                <FormDescription className={cn(index !== 0 && "sr-only")}>
                  Добавьте дополнительные поля с информацией о книге.
                </FormDescription>
                <FormControl>
                  <div className="flex flex-col items-center gap-2 sm:flex-row">
                    <FormField
                      control={form.control}
                      name={`fields.${index}.title`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Input {...field} placeholder="Название поля" />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`fields.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Input {...field} placeholder="Значение поля" />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ title: "", value: "" })}
            >
              <Plus />
              Добавить поле
            </Button>
          </div>
          <Button
            type="submit"
            disabled={editMutation.isPending}
            className="gap-2"
          >
            {editMutation.isPending ? (
              <Loader className="size-4 animate-spin" />
            ) : (
              <Edit className="size-4" />
            )}
            Редактировать
          </Button>
        </form>
      </Form>
    </DrawerDialog>
  )
}
