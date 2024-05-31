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
  content: z
    .string({ required_error: "Поле обязательно для заполнения" })
    .min(1, "Поле обязательно для заполнения"),
})

export default function AnswerQuestion({questionId}: {questionId: string}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    }
  })
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    const resp = await fetch(`/api/support/${questionId}`, {
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
      router.refresh()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-2">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
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
  )
}
