import { openrouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, streamText } from "ai";
import type { NextRequest } from "next/server";
import { toolSetForUser } from "@/lib/ai/tools/toolset";
import type { MyUIMessage } from "@/lib/ai/message";
import { sanitizeMessagesForProvider } from "@/lib/ai/message";
import { db } from "@/lib/db";
import { normalizeDefaultFields } from "@/lib/default-fields";
import { validateRequest } from "@/lib/server-validate-request";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const CHAT_MODEL = "deepseek/deepseek-v4.1-flash-1017";
const CHAT_PROVIDER = {
  order: ["particle-ai/us/flex"],
  allow_fallbacks: false,
};

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { aiEnabled } = await db.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    select: {
      aiEnabled: true,
    },
  });
  if (!aiEnabled) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = (await req.json()) as unknown;
  const bodyRecord =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};

  const messages = Array.isArray(bodyRecord.messages)
    ? (bodyRecord.messages.filter((message) => {
        if (typeof message !== "object" || message === null) {
          return false;
        }

        const role = (message as { role?: unknown }).role;
        return (
          (role === "user" || role === "assistant" || role === "system") &&
          Array.isArray((message as { parts?: unknown }).parts)
        );
      }) as MyUIMessage[])
    : [];
  const allowedTools = Array.isArray(bodyRecord.allowedTools)
    ? bodyRecord.allowedTools.filter(
        (tool): tool is string => typeof tool === "string",
      )
    : [];
  const defaultFields = normalizeDefaultFields(bodyRecord.defaultFields);

  const toolSet = Object.fromEntries(
    Object.entries(toolSetForUser(user)).filter(([key, _value]) =>
      allowedTools.includes(key),
    ),
  );

  const result = streamText({
    // model: openai("gpt-4.1"),
    model: openrouter(CHAT_MODEL as any, { provider: CHAT_PROVIDER }),
    system: `Ты - помощник пользователя в онлайн-сайте Читательский Дневник. Ты должен отвечать только на запросы по теме книг: создание, удаление, т.д. Также ты можешь общаться с пользователем на темы, близкие к книгам, и рекомендовать ему их. Никогда не сообщай пользователю идентфикаторы. Если запуск функции требует получения идентификатора объекта, нельзя спрашивать об этом у пользователя, а нужно получить список всех объектов и извлечь оттуда идентификатор. Не используй много заголовков. Если пользователь отклонил выполнение инструмента, не пытайся выполнить тот же инструмент снова без явной просьбы: кратко подтверди отмену и предложи безопасную альтернативу. Если ты запустил функцию (tool), не забывай, что если пользователь просил о списке, то нужно написать о нём в текстовом виде. Сегодня - ${new Date().toLocaleDateString("ru-RU")}. Никогда не отправляй ссылки на изображения в чат. Поля, которые пользователь выбрал в настройках для книг: ${defaultFields.length > 0 ? defaultFields.join(", ") : "не задано"}. При создании книги всегда добавляй эти поля, заполняя значения, которые знаешь; неизвестные значения оставляй пустыми и не придумывай их.`,
    messages: convertToModelMessages(sanitizeMessagesForProvider(messages)),
    tools: toolSet,
  });

  return result.toUIMessageStreamResponse();
}
