import { toolSetForUser } from "@/lib/ai/tools/toolset";
import { validateRequest } from "@/lib/server-validate-request";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { NextRequest } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const {
    messages,
    allowedTools,
  }: { messages: UIMessage[]; allowedTools?: string[] } = await req.json();
  const { user } = await validateRequest();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const toolSet = Object.fromEntries(
    Object.entries(toolSetForUser(user)).filter(([key, value]) =>
      allowedTools?.includes(key),
    ),
  );

  const result = streamText({
    // model: openai("gpt-4.1"),
    model: openrouter("moonshotai/kimi-k2-0905") as any,
    system:
      "Ты - помощник пользователя в онлайн-сайте Читательский Дневник. Ты должен отвечать только на запросы по теме книг: создание, удаление, т.д. Также ты можешь общаться с пользователем на темы, близкие к книгам, и рекомендовать ему их. Никогда не сообщай пользователю идентфикаторы. Если запуск функции требует получения идентификатора объекта, нельзя спрашивать об этом у пользователя, а нужно получить список всех объектов и извлечь оттуда идентификатор. Не используй много заголовков. Если ты запустил функцию (tool), не забывай, что если пользователь просил о списке, то нужно написать о нём в текстовом виде.",
    messages: convertToModelMessages(messages),
    tools: toolSet,
  });

  return result.toUIMessageStreamResponse();
}
