"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DialogTitle } from "@/components/ui/dialog";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  addRecommendation,
  deleteRecommendation,
  duplicateRecommendation,
  editRecommendation,
} from "@/lib/actions/recommendations";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Recommendation } from "@prisma/client";
import { addDays, format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  CalendarIcon,
  CopyIcon,
  Loader2Icon,
  PencilIcon,
  Plus,
  Save,
  TrashIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  slogan: z.string().min(1, "Слоган обязателен"),
  bookInfo: z.string().min(1, "Информация о книге обязательна"),
  title: z.string().min(1, "Название книги обязательно"),
  author: z.string().min(1, "Автор книги обязателен"),
  pages: z.coerce
    .number({ required_error: "Нужно ввести количество страниц" })
    .min(1, "Количество страниц обязательно"),
  startsOn: z.date({ required_error: "Дата начала обязательна" }),
  endsOn: z.date({ required_error: "Дата конца обязательна" }),
  published: z.boolean(),
});

export function AddRecommendation({
  recommendation,
  open,
  setOpen,
}: {
  recommendation?: Recommendation;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slogan: recommendation?.slogan ?? "",
      bookInfo: recommendation?.bookInfo ?? "",
      title: recommendation?.title ?? "",
      author: recommendation?.author ?? "",
      pages: recommendation?.pages ?? 0,
      startsOn: recommendation?.startsOn ?? new Date(),
      endsOn: recommendation?.endsOn ?? addDays(new Date(), 6),
      published: recommendation?.published ?? false,
    },
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    if (recommendation) {
      const res = await editRecommendation(recommendation.id, values);
      toast.success(res.message);
    } else {
      const res = await addRecommendation(values);
      toast.success(res.message);
    }
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[40vw]">
      <DialogTitle>Добавить рекомендацию</DialogTitle>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="slogan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Слоган</FormLabel>
                <FormControl>
                  <Input placeholder="Эта книга подойдёт..." {...field} />
                </FormControl>
                <FormDescription>
                  Напишите здесь то, что пользователи должны увидеть о книге
                  сразу.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bookInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Информация о книге</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="В этой книге рассказывается о..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Тут нужно написать побольше о сюжете книги, но без спойлеров.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название книги</FormLabel>
                <FormControl>
                  <Input placeholder="Война и мир" {...field} />
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
                <FormLabel>Автор книги</FormLabel>
                <FormControl>
                  <Input placeholder="Иван Иванов" {...field} />
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
                <FormLabel>Количество страниц в книге</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="52" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startsOn"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Дата начала</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
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
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      locale={ru}
                      weekStartsOn={1}
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={{ before: new Date() }}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endsOn"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Дата конца</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
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
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      locale={ru}
                      weekStartsOn={1}
                      selected={field.value}
                      onSelect={field.onChange}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Опубликовать?</FormLabel>
                  <FormDescription>
                    Должна ли рекомендация сразу быть показанной пользователям?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2Icon className="animate-spin" /> : <Save />}Сохранить
          </Button>
        </form>
      </Form>
    </DrawerDialog>
  );
}

export default function AddRecommendationButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus /> Добавить рекомендацию
      </Button>
      <AddRecommendation open={open} setOpen={setOpen} />
    </>
  );
}

export function EditRecommendationButton({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        <PencilIcon /> Редактировать рекомендацию
      </Button>
      <AddRecommendation
        open={open}
        setOpen={setOpen}
        recommendation={recommendation}
      />
    </>
  );
}

export function DeleteRecommendationButton({
  recommendationId,
}: {
  recommendationId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const runAction = async () => {
    setLoading(true);
    const res = await deleteRecommendation(recommendationId);
    setLoading(false);
    // if (res.error) {
    //   toast.error("Возникла проблема при удалении рекомендации", {
    //     description: res.error,
    //   });
    // }
    if (res.message) {
      toast.success(res.message);
      router.refresh();
    }
  };

  return (
    <Button onClick={runAction} disabled={loading} variant="destructive">
      {loading ? <Loader2Icon className="animate-spin" /> : <TrashIcon />}
      Удалить рекомендацию
    </Button>
  );
}

export function DuplicateRecommendationButton({
  recommendationId,
}: {
  recommendationId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const runAction = async () => {
    setLoading(true);
    const res = await duplicateRecommendation(recommendationId);
    setLoading(false);
    if (res.message) {
      toast.success(res.message);
      router.refresh();
    }
  };

  return (
    <Button onClick={runAction} disabled={loading} variant="outline">
      {loading ? <Loader2Icon className="animate-spin" /> : <CopyIcon />}
      Дублировать рекомендацию
    </Button>
  );
}
