"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "@/components/ui/loader";
import { Textarea } from "@/components/ui/textarea";
import { answerQuestion } from "@/lib/actions/support";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  content: z
    .string({ required_error: "Поле обязательно для заполнения" })
    .min(1, "Поле обязательно для заполнения"),
});

export default function AnswerQuestion({ questionId }: { questionId: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function onSubmit({ content }: z.infer<typeof formSchema>) {
    setLoading(true);
    const res = await answerQuestion(questionId, content);
    setLoading(false);
    if (res.error) {
      toast.error("Проблема при отправке вопроса", {
        description: res.error,
      });
    } else {
      toast.success(res.message);
      form.reset();
      router.refresh();
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
  );
}
