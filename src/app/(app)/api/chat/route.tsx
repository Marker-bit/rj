import { toolSetForUser } from "@/lib/ai/tools/toolset";
import { validateRequest } from "@/lib/server-validate-request";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, streamText, UIMessage } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const { user } = await validateRequest();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const toolSet = toolSetForUser(user);

  const result = streamText({
    // model: openai("gpt-4.1"),
    model: openrouter("minimax/minimax-m2") as any,
    system:
      "Ты - помощник пользователя в онлайн-сайте Читательский Дневник. Ты должен отвечать только на запросы по теме книг: создание, удаление, т.д. Также ты можешь общаться с пользователем на темы, близкие к книгам, и рекомендовать ему их. Никогда не сообщай пользователю идентфикаторы. Если запуск функции требует получения идентификатора объекта, нельзя спрашивать об этом у пользователя, а нужно получить список всех объектов и извлечь оттуда идентификатор. Не используй много или большие заголовки. Если ты запустил функцию (tool), не забывай, что если пользователь просил о списке, то нужно написать о нём в текстовом виде.",
    messages: convertToModelMessages(messages),
    tools: toolSet,
  });

  return result.toUIMessageStreamResponse();
}
