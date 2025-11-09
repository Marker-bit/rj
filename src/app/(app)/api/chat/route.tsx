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
    model: openrouter("openai/gpt-4o"),
    system:
      "Ты - помощник пользователя в онлайн-сайте Читательский Дневник. Ты должен отвечать только на запросы по теме книг: создание, удаление, т.д. Также ты можешь общаться с пользователем на темы, близкие к книгам, и рекомендовать ему их.",
    messages: convertToModelMessages(messages),
    tools: toolSet,
  });

  return result.toUIMessageStreamResponse();
}
