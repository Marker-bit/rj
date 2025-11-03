import { toolSetForUser } from "@/lib/ai/tools/toolset";
import { validateRequest } from "@/lib/server-validate-request";
import { openai } from "@ai-sdk/openai";
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
    model: openai("gpt-4.1"),
    system: "You are a helpful assistant.",
    messages: convertToModelMessages(messages),
    tools: toolSet,
  });

  return result.toUIMessageStreamResponse();
}
