"use client";

import { IconBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { Input } from "@/components/ui/input";
import { addRecommendation } from "@/lib/actions/recommendations";
import { addDays, startOfDay, startOfToday } from "date-fns";
import {
  CircleAlert,
  CircleDollarSign,
  DollarSign,
  LoaderIcon,
  Router,
  SparklesIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";

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

export const getRecommendation = async (
  apiKey: string,
  modelName: string
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
        messages: [{ role: "user", content: DEFAULT_PROMPT }],
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
  const [saveLoading, setSaveLoading] = useState(false);
  const [result, setResult] = useState<
    { recommendation: Rec; cost: number } | { error: string }
  >();
  const router = useRouter();

  const runAction = async (evt: FormEvent) => {
    evt.preventDefault();
    setLoading(true);
    const recommendation = await getRecommendation(
      openRouterToken,
      "google/gemini-2.5-flash-preview-05-20"
    );
    setResult(recommendation);
    setLoading(false);
    setOpen(true);
  };

  const today = startOfToday()

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
      <DrawerDialog open={open} onOpenChange={setOpen} className="w-[50vw]">
        <DialogHeader>
          <DialogTitle>Генерация рекомендаций</DialogTitle>
        </DialogHeader>
        <h2 className="mb-1 text-sm font-semibold">Ваш токен для OpenRouter</h2>
        <form className="space-y-3" onSubmit={runAction}>
          <Input
            id="openRouterToken"
            type="password"
            value={openRouterToken}
            onChange={(e) => setOpenRouterToken(e.target.value)}
          />
          <div className="flex flex-col sm:flex-row sm:justify-between items-center">
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
            <Button size="sm" disabled={!openRouterToken || loading}>
              Сгенерировать
            </Button>
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
              <div className="line-clamp-3 text-sm text-muted-foreground">
                {result.recommendation.bookInfo}
              </div>
              <IconBadge icon={CircleDollarSign} variant="outline">
                ${result.cost.toFixed(5)} потрачено
              </IconBadge>
              <Button disabled={saveLoading} onClick={save}>
                Сохранить
              </Button>
            </div>
          ))}
      </DrawerDialog>
      <Button
        variant="outline"
        disabled={loading}
        onClick={() => setOpen(true)}
        // onClick={() => {
        //   if (openRouterToken) {
        //     runAction();
        //   } else {
        //     setPopoverOpen(true);
        //   }
        // }}
      >
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
