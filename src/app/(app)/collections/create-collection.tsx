"use client"

import { DialogHeader } from "@/components/ui/dialog"
import { DrawerDialog } from "@/components/drawer"
import { DialogTitle } from "@radix-ui/react-dialog"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Loader } from "@/components/ui/loader"

const formSchema = z.object({
  name: z.string().min(1, { message: "Поле обязательно для заполнения" }),
})

export function CreateCollection() {
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const router = useRouter()

  const collectionMutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return fetch("/api/collections", {
        method: "POST",
        body: JSON.stringify(values),
      })
    },
    onSuccess: () => {
      router.refresh()
      handleClose(false)
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    collectionMutation.mutate(values)
  }

  function handleClose(b: boolean) {
    setOpen(b)
    if (!b) {
      form.reset()
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="m-2 items-center gap-2 md:w-fit"
      >
        <Plus className="size-4" />
        Создать коллекцию
      </Button>
      <DrawerDialog
        open={open}
        onOpenChange={handleClose}
        className="min-w-[40vw]"
      >
        <DialogHeader>
          <DialogTitle>Создать коллекцию</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input {...field} autoFocus />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="ml-auto mt-2 gap-2"
              disabled={collectionMutation.isPending}
            >
              {collectionMutation.isPending ? (
                <Loader className="size-4" />
              ) : (
                <Plus className="size-4" />
              )}
              Создать
            </Button>
          </form>
        </Form>
      </DrawerDialog>
    </>
  )
}
