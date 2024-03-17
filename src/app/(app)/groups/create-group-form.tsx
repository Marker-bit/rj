"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1),
});

export function CreateGroupForm({ onDone }: { onDone: () => void }) {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setLoading(true);
    fetch("/api/groups", {
      method: "POST",
      body: JSON.stringify(values),
    }).then(() => {
      setLoading(false);
      onDone();
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <Button
            type="button"
            // disabled={loading}
            onClick={(evt) => {
              setLoading(!loading);
              evt.preventDefault();
            }}
            className="gap-2 overflow-hidden"
          >
            <AnimatePresence mode="popLayout">
              {loading && (
                <motion.div
                  initial={{ y: 30 }}
                  animate={{ y: 0 }}
                  exit={{ y: -30 }}
                  className="flex items-center gap-2"
                  key="loading"
                >
                  <Loader className="w-4 h-4 animate-spin" />
                  <div className="max-sm:hidden">Добавляем...</div>
                </motion.div>
              )}
              {!loading && (
                <motion.div
                  initial={{ y: 30 }}
                  animate={{ y: 0 }}
                  exit={{ y: -30 }}
                  className="flex items-center gap-2"
                  key="add"
                >
                  <PlusIcon className="w-4 h-4" />
                  <div className="max-sm:hidden">Добавить</div>
                </motion.div>
              )}
            </AnimatePresence>
          </Button> */}
        <Button
          type="submit"
          // disabled={loading}
          // onClick={() => setLoading(true)}
          className="gap-2"
          key="create-group"
        >
          <AnimatePresence mode="popLayout">
            {loading && (
              <motion.div
                initial={{ y: 30 }}
                animate={{ y: 0 }}
                exit={{ y: -30 }}
                className="flex items-center gap-2"
                key="loading"
              >
                <Loader className="w-4 h-4 animate-spin" />
                <div className="max-sm:hidden">Добавляем...</div>
              </motion.div>
            )}
            {!loading && (
              <motion.div
                initial={{ y: 30 }}
                animate={{ y: 0 }}
                exit={{ y: -30 }}
                className="flex items-center gap-2"
                key="add"
              >
                <PlusIcon className="w-4 h-4" />
                <div className="max-sm:hidden">Добавить</div>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </form>
    </Form>
  );
}
