"use server";

import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateObject } from "ai";
import z from "zod";

const IMAGE_MODEL = "qwen/qwen3-vl-30b-a3b-thinking";

export async function generateBookData(base64File: string) {
  const res = await generateObject({
    model: openrouter(IMAGE_MODEL),
    messages: [
      {
        role: "system",
        content:
          "Вытащи всю информацию из внутренней страницы книги на картинке или верни null, если это невозможно. ВНИМАНИЕ! Не возвращай пустые поля: верни null для всего объекта book вместо конкретных полей.",
      },
      {
        role: "user",
        content: [
          {
            type: "image",
            image: base64File,
          },
        ],
      },
    ],
    schema: z.object({
      book: z
        .object({
          title: z.string(),
          author: z.string(),
          pages: z.number(),
          publisher: z.string(),
          releaseYear: z.number(),
        })
        .or(z.null()),
      additionalInfo: z
        .string()
        .describe(
          "Ты можешь поместить информацию о проблемах с распознаванием здесь (по русски).",
        )
        .optional(),
    }),
  });

  return res.object;
}
