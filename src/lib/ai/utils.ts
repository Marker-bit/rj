import type { UIMessage } from "ai";

export function getMessageTextParts(message: UIMessage): string[] {
  return message.parts.flatMap((part) =>
    part.type === "text" && part.text.trim() ? [part.text] : [],
  );
}

export function getCopyableMessageText(
  message: UIMessage,
  textPartIndex?: number | null,
): string {
  const textParts = getMessageTextParts(message);
  if (textParts.length === 0) {
    throw new Error("Сообщение не содержит текст");
  }

  const selectedTextPart =
    textPartIndex != null ? textParts[textPartIndex] : undefined;
  if (selectedTextPart !== undefined) {
    return selectedTextPart;
  }

  return textParts.join("\n\n");
}

export function getCopyableAnswerText(message: UIMessage): string {
  const lastTextPart = getMessageTextParts(message).at(-1);
  if (!lastTextPart) {
    throw new Error("Сообщение не содержит текст");
  }

  return lastTextPart;
}
