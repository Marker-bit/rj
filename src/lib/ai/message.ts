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

type PartGroup = ToolUIPart[] | TextUIPart;

export function groupMessageParts(message: MyUIMessage): PartGroup[] {
  const groupedParts: PartGroup[] = [];
  let currentGroup: ToolUIPart[] = [];

  for (const part of message.parts) {
    if (part.type === "text") {
      if (currentGroup.length > 0) {
        groupedParts.push(currentGroup);
        currentGroup = [];
      } else {
        groupedParts.push(part);
      }
    } else if (isToolUIPart(part)) {
      currentGroup.push(part);
    }
  }

  if (currentGroup.length > 0) {
    groupedParts.push(currentGroup);
  }

  return groupedParts;
}
