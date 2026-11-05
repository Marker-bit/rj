import {
  type InferUITools,
  isToolUIPart,
  type TextUIPart,
  type ToolUIPart,
  type UIDataTypes,
  type UIMessage,
  type UIMessagePart,
} from "ai";
import type { toolSetForUser } from "@/lib/ai/tools/toolset";

export type MyUIMessage = UIMessage<
  unknown,
  UIDataTypes,
  InferUITools<ReturnType<typeof toolSetForUser>>
>;

export type MyUIMessagePart = UIMessagePart<
  UIDataTypes,
  InferUITools<ReturnType<typeof toolSetForUser>>
>;

export function sanitizeMessagesForProvider(
  messages: MyUIMessage[],
): MyUIMessage[] {
  return messages.flatMap((message) => {
    const parts: MyUIMessagePart[] = [];

    for (const part of message.parts) {
      if (part.type === "text") {
        if (typeof part.text === "string") {
          parts.push(part);
        }
        continue;
      }

      // Some providers do not understand the approval-response part and
      // serialize the following tool message without content. Convert a denied
      // approval into the regular output-denied state so the provider receives
      // a proper tool result.
      if (
        isToolUIPart(part) &&
        part.state === "approval-responded" &&
        !part.approval.approved
      ) {
        parts.push({
          ...part,
          state: "output-denied",
          approval: { ...part.approval, approved: false },
        } as unknown as MyUIMessagePart);
        continue;
      }

      parts.push(part);
    }

    if (parts.length === 0) {
      return [];
    }

    return [{ ...message, parts }];
  });
}

type PartGroup = ToolUIPart[] | TextUIPart;

export function groupMessageParts(message: MyUIMessage): PartGroup[] {
  const groupedParts: PartGroup[] = [];
  let currentGroup: ToolUIPart[] = [];

  for (const part of message.parts) {
    if (part.type === "reasoning") {
      continue;
    }
    if (part.type === "text") {
      if (currentGroup.length > 0) {
        groupedParts.push(currentGroup);
        currentGroup = [];
      }

      groupedParts.push(part);
    } else if (isToolUIPart(part)) {
      currentGroup.push(part);
    }
  }

  if (currentGroup.length > 0) {
    groupedParts.push(currentGroup);
  }

  return groupedParts;
}
