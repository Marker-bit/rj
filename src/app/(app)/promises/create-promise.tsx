"use client"

import { Button } from "@/components/ui/button"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DrawerDialog } from "@/components/ui/drawer-dialog"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { Book, PromiseMode } from "@prisma/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { addDays, format } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import BooksSelect from "./books-select"

const formSchema = z
  .object({
    dueDate: z
      .date({
        required_error: "Поле обязательно для заполнения",
        invalid_type_error: "Некорректная дата",
      })
      .min(new Date(), { message: "Нельзя установить дату в прошлом" }),
    pagesCount: z.coerce
      .number({
        required_error: "Поле обязательно для заполнения",
        invalid_type_error: "Некорректное значение",
      })
      .optional(),
    streakPages: z.coerce
      .number({
        required_error: "Поле обязательно для заполнения",
        invalid_type_error: "Некорректное значение",
      })
      .optional(),
    mode: z.enum([
      PromiseMode.FULL_BOOKS,
      PromiseMode.READ_PAGES,
      PromiseMode.STREAK,
    ]),
    books: z.array(z.string()).optional(),
  })
  .refine(
    (data) =>
      data.mode !== PromiseMode.FULL_BOOKS ||
      (data.books?.length !== 0 && data.books),
    {
      message: "Надо выбрать хотя бы одну книгу",
      path: ["books"],
    }
  )
  .refine(
    (data) =>
      data.mode !== PromiseMode.READ_PAGES ||
      (data.pagesCount !== 0 && data.pagesCount),
    {
      message: "Надо указать количество страниц",
      path: ["pagesCount"],
    }
  )
  .refine(
    (data) =>
      data.mode !== PromiseMode.STREAK ||
      (data.streakPages !== 0 && data.streakPages),
    {
      message: "Надо указать количество прочитанных страниц в день",
      path: ["streakPages"],
    }
  )

export default function CreatePromise({ books }: { books: Book[] }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mode: PromiseMode.FULL_BOOKS,
      dueDate: addDays(new Date(), 1),
    },
  })
  const mode = form.watch("mode")

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="w-fit">
        Создать обещание
      </Button>
      <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
        <DialogHeader>
          <DialogTitle>Создать обещание</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип обещания</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0 rounded-xl border p-2">
                        <FormControl>
                          <RadioGroupItem value={PromiseMode.FULL_BOOKS} />
                        </FormControl>
                        <div className="flex flex-col">
                          <FormLabel>Дочитать книги</FormLabel>
                          <FormDescription>
                            Дочитать выбранные книги к сроку
                          </FormDescription>
                        </div>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 rounded-xl border p-2">
                        <FormControl>
                          <RadioGroupItem value={PromiseMode.READ_PAGES} />
                        </FormControl>
                        <div className="flex flex-col">
                          <FormLabel>Прочитать много</FormLabel>
                          <FormDescription>
                            Прочитать определённое количество страниц к сроку
                          </FormDescription>
                        </div>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 rounded-xl border p-2">
                        <FormControl>
                          <RadioGroupItem value={PromiseMode.STREAK} />
                        </FormControl>
                        <div className="flex flex-col">
                          <FormLabel>N страниц в день</FormLabel>
                          <FormDescription>
                            Читать определённое количество страниц каждый день
                          </FormDescription>
                        </div>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {mode === PromiseMode.FULL_BOOKS && (
              <FormField
                control={form.control}
                name="books"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Книги</FormLabel>
                    <BooksSelect books={books} field={field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {mode === PromiseMode.READ_PAGES && (
              <FormField
                control={form.control}
                name="pagesCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Кол-во страниц</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {mode === PromiseMode.STREAK && (
              <FormField
                control={form.control}
                name="streakPages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Минимальное кол-во страниц в день</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Выполнять до</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ru })
                          ) : (
                            <span>Выберите дату</span>
                          )}
                          <CalendarIcon className="ml-auto size-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        locale={ru}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Создать</Button>
          </form>
        </Form>
      </DrawerDialog>
    </>
  )
}
