"use client";

import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { createCollection } from "@/lib/actions/collections";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Поле обязательно для заполнения" }),
});

export function CreateCollection() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const router = useRouter();

  async function onSubmit({ name }: z.infer<typeof formSchema>) {
    setLoading(true);
    const res = await createCollection(name);
    setLoading(false);
    if (res.error) {
      toast.error("Произошла ошибка при создании коллекции", {
        description: res.error,
      });
    }
    if (res.message && res.collection) {
      toast.success(res.message);
      router.refresh();
      handleClose(false);
    }
  }

  function handleClose(b: boolean) {
    setOpen(b);
    if (!b) {
      form.reset();
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
              disabled={loading}
            >
              {loading ? (
                <Loader invert className="size-4" />
              ) : (
                <Plus className="size-4" />
              )}
              Создать
            </Button>
          </form>
        </Form>
      </DrawerDialog>
    </>
  );
}
