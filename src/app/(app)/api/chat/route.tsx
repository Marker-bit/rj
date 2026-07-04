import { openrouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import type { NextRequest } from "next/server";
import { toolSetForUser } from "@/lib/ai/tools/toolset";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

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

  const {
    messages,
    allowedTools,
  }: { messages: UIMessage[]; allowedTools?: string[] } = await req.json();

  const toolSet = Object.fromEntries(
    Object.entries(toolSetForUser(user)).filter(([key, _value]) =>
      allowedTools?.includes(key),
    ),
  );

  const result = streamText({
    // model: openai("gpt-4.1"),
    model: openrouter("deepseek/deepseek-v4-flash") as any,
    system: `Ты - помощник пользователя в онлайн-сайте Читательский Дневник. Ты должен отвечать только на запросы по теме книг: создание, удаление, т.д. Также ты можешь общаться с пользователем на темы, близкие к книгам, и рекомендовать ему их. Никогда не сообщай пользователю идентфикаторы. Если запуск функции требует получения идентификатора объекта, нельзя спрашивать об этом у пользователя, а нужно получить список всех объектов и извлечь оттуда идентификатор. Не используй много заголовков. Если пользователь отклонил выполнение инструмента, не пытайся выполнить тот же инструмент снова без явной просьбы: кратко подтверди отмену и предложи безопасную альтернативу. Если ты запустил функцию (tool), не забывай, что если пользователь просил о списке, то нужно написать о нём в текстовом виде. Сегодня - ${new Date().toDateString()}`,
    messages: convertToModelMessages(messages),
    tools: toolSet,
  });

  return result.toUIMessageStreamResponse();
}
