"use client"

import { Button } from "@/components/ui/button"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DrawerDialog } from "@/components/ui/drawer-dialog"
import { MessageCircleQuestion } from "lucide-react"
import { useState } from "react"
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
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader } from "@/components/ui/loader"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  title: z
    .string({ required_error: "Поле обязательно для заполнения" })
    .min(1, "Поле обязательно для заполнения"),
  content: z
    .string({ required_error: "Поле обязательно для заполнения" })
    .min(1, "Поле обязательно для заполнения"),
})

export default function AskQuestion() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    const resp = await fetch("/api/support", {
      method: "POST",
      body: JSON.stringify(values),
    })
    const res = await resp.json()
    setLoading(false)
    if (res.error) {
      toast.error("Проблема при отправке вопроса", {
        description: res.error,
      })
    } else {
      toast.success(res.message)
      form.reset()
      setOpen(false)
      router.refresh()
    }
  }

  return (
    <>
      <Button className="gap-2" onClick={() => setOpen(true)}>
        <MessageCircleQuestion className="size-4" />
        Задать вопрос
      </Button>
      <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
        <DialogHeader>
          <DialogTitle>Задать вопрос</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Заголовок</FormLabel>
                  <FormControl>
                    <Input disabled={loading} className="text-2xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Содержание</FormLabel>
                  <FormControl>
                    <Textarea disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading && <Loader invert className="size-4" />}Отправить
            </Button>
          </form>
        </Form>
      </DrawerDialog>
    </>
  )
}
