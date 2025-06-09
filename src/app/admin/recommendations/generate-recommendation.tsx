"use client";

import { IconBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { addRecommendation } from "@/lib/actions/recommendations";
import { addDays, startOfToday } from "date-fns";
import {
  BoltIcon,
  BotIcon,
  CircleAlert,
  CircleDollarSign,
  ClipboardCopyIcon,
  Loader2Icon,
  LoaderIcon,
  SaveIcon,
  SearchIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useCopyToClipboard, useLocalStorage } from "usehooks-ts";

const DEFAULT_PROMPT = `Сгенерируй рекомендацию какой-нибудь существующей книги для школьников 10+ (выбери конкретную аудиторию, например девочки 13+ (пример не бери)).`;

//  и дай мне ответ в формате JSON с полями:
// 1. \`slogan\` - Краткое описание, например "Эта книга подойдёт всем девочкам 13+"
// 2. \`bookInfo\` - Описание подлиннее, рассказывающее о книге (без спойлеров)
// 3. \`title\`, \`author\` - информация о книге

// export const getRecommendation = async (apiKey: string, modelName: string) => {
//   const openrouter = createOpenRouter({
//     apiKey,
//   });

//   const { object } = await generateObject({
//     model: openrouter(modelName),
//     prompt: DEFAULT_PROMPT,
//     schema: z.object({
//       slogan: z
//         .string()
//         .describe(
//           'Краткое описание, например "Эта книга подойдёт всем девочкам 13+"'
//         ),
//       bookInfo: z
//         .string()
//         .describe("Описание подлиннее, рассказывающее о книге (без спойлеров)"),
//       title: z.string().describe("Название книги"),
//       author: z.string().describe("Автор книги"),
//       // pages: z.number(),
//       // startsOn: z.date(),
//       // endsOn: z.date(),
//       // published: z.boolean(),
//     }),
//   });

//   return object;
// };

type Rec = { slogan: string; bookInfo: string; title: string; author: string };

const getRecommendation = async (
  apiKey: string,
  modelName: string,
  prompt?: string
): Promise<{ recommendation: Rec; cost: number } | { error: string }> => {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: "user", content: prompt || DEFAULT_PROMPT }],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "recommendation",
            strict: true,
            schema: {
              type: "object",
              properties: {
                slogan: {
                  type: "string",
                  description:
                    'Краткое описание, например "Эта книга подойдёт всем девочкам 13+"',
                },
                bookInfo: {
                  type: "string",
                  description:
                    "Описание подлиннее, рассказывающее о книге (без спойлеров)",
                },
                title: {
                  type: "string",
                  description: "Название книги",
                },
                author: {
                  type: "string",
                  description: "Автор книги",
                },
              },
              required: ["slogan", "bookInfo", "title", "author"],
              additionalProperties: false,
            },
          },
        },
        usage: {
          include: true,
        },
      }),
    }
  );

  const data = await response.json();
  if ("error" in data) {
    return { error: data.error.message };
  }
  const recommendation = JSON.parse(data.choices[0].message.content);

  return { recommendation, cost: data.usage.cost };
};

export default function GenerateRecommendation() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openRouterToken, setOpenRouterToken] = useLocalStorage<string>(
    "openRouterToken",
    ""
  );
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [model, setModel] = useState("google/gemini-2.5-flash-preview-05-20");
  const [saveLoading, setSaveLoading] = useState(false);
  const [result, setResult] = useState<
    { recommendation: Rec; cost: number } | { error: string }
  >();
  const router = useRouter();
  const [copiedText, copyToClipboard] = useCopyToClipboard();

  const runAction = async (evt: FormEvent) => {
    evt.preventDefault();
    setLoading(true);
    const recommendation = await getRecommendation(
      openRouterToken,
      model,
      prompt
    );
    setResult(recommendation);
    setLoading(false);
    setOpen(true);
  };

  const today = startOfToday();

  const save = async () => {
    if (result && "recommendation" in result) {
      setSaveLoading(true);
      const res = await addRecommendation({
        ...result.recommendation,
        pages: 0,
        startsOn: today,
        endsOn: addDays(today, 6),
        published: false,
      });
      toast.success(res.message);
      setSaveLoading(false);
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <>
      <DrawerDialog
        open={open}
        onOpenChange={setOpen}
        className="w-[50vw] max-w-[50vw]!"
      >
        <DialogHeader>
          <DialogTitle>Генерация рекомендаций</DialogTitle>
        </DialogHeader>
        <form className="space-y-3 mt-2" onSubmit={runAction}>
          <Label htmlFor="model">Модель для генерации</Label>
          <Input
            id="model"
            className="font-mono"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
          <Label htmlFor="prompt">Промпт для нейросети</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Введите ваш промпт"
            rows={5}
          />
          <div className="flex gap-2 sm:justify-end">
            <Button disabled={!openRouterToken || loading}>
              {loading ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <BotIcon className="opacity-60" />
              )}
              Сгенерировать
            </Button>
            <Popover>
              <SimpleTooltip text="Открыть настройки" asChild>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Открыть настройки"
                    type="button"
                  >
                    <BoltIcon className="size-4" aria-hidden="true" />
                  </Button>
                </PopoverTrigger>
              </SimpleTooltip>
              <PopoverContent className="w-72 space-y-2">
                <Label htmlFor="openRouterToken">Токен OpenRouter</Label>
                <Input
                  id="openRouterToken"
                  className="font-mono"
                  type="password"
                  value={openRouterToken}
                  onChange={(e) => setOpenRouterToken(e.target.value)}
                />

                <div className="text-muted-foreground text-xs">
                  Получите его{" "}
                  <a
                    href="https://openrouter.ai/settings/keys"
                    target="_blank"
                    className="underline"
                  >
                    тут
                  </a>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </form>
        {result &&
          ("error" in result ? (
            <div className="rounded-md border px-4 py-3">
              <p className="text-sm">
                <CircleAlert
                  className="me-3 -mt-0.5 inline-flex text-red-500"
                  size={16}
                  aria-hidden="true"
                />
                {result.error}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-2 border p-4 rounded-xl">
              <div className="text-2xl font-bold -mb-2">
                {result.recommendation.slogan}
              </div>
              <div className="text-sm">
                {result.recommendation.title} - {result.recommendation.author}
              </div>
              <div className="text-sm text-muted-foreground">
                {result.recommendation.bookInfo}
              </div>
              <IconBadge icon={CircleDollarSign} variant="outline">
                ${result.cost.toFixed(5)} потрачено
              </IconBadge>
              <div className="flex gap-2 flex-wrap">
                <Button disabled={saveLoading} onClick={save}>
                  {saveLoading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <SaveIcon className="opacity-60" aria-hidden="true" />
                  )}
                  Сохранить
                </Button>
                <Button
                  onClick={() => {
                    copyToClipboard(
                      JSON.stringify({
                        ...result.recommendation,
                        pages: 0,
                        startsOn: today,
                        endsOn: addDays(today, 6),
                        published: false,
                      })
                    );
                    toast.success("Рекомендация скопирована в буфер обмена");
                  }}
                  variant="outline"
                >
                  <ClipboardCopyIcon
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  Копировать в буфер
                </Button>
                <Button asChild variant="outline">
                  <Link
                    href={`https://www.google.com/search?q=${result.recommendation.title}+${result.recommendation.author}`}
                    target="_blank"
                  >
                    <SearchIcon
                      className="opacity-60 size-4"
                      aria-hidden="true"
                    />
                    Открыть Google
                  </Link>
                </Button>
              </div>
            </div>
          ))}
      </DrawerDialog>
      <Button variant="outline" onClick={() => setOpen(true)}>
        {loading ? (
          <LoaderIcon
            className="opacity-60 size-4 animate-spin"
            aria-hidden="true"
          />
        ) : (
          <SparklesIcon className="opacity-60 size-4" aria-hidden="true" />
        )}
        Сгенерировать
      </Button>
    </>
  );
}
