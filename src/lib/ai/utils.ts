import type { UIMessage } from "ai";

export function getCopyableMessageText(message: UIMessage): string {
  const textPart = message.parts.find((part) => part.type === "text");
  if (!textPart) {
    throw new Error("Сообщение не содержит текст");
  }
  return textPart.text;
}
