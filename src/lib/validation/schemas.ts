import { z } from "zod";

import { USERNAME_MESSAGE, USERNAME_REGEX } from "@/lib/api-validate";

export const registerSchema = z.object({
  username: z
    .string()
    .regex(
      /^[a-zA-Z0-9_.-]{3,15}$/,
      "Имя пользователя должно быть буквенно-цифровой строкой, которая может включать в себя _, . и -, длиной от 3 до 15 символов.",
    ),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
  // .regex(
  //   /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&.*-]).{8,}$/,
  //   "Пароль должен содержать минимум 8 символов, по крайней мере одну заглавную английскую букву, одну строчную английскую букву, одну цифру и один специальный символ"
  // )
  firstName: z
    .string({
      error: "Имя обязательно",
    })
    .min(3, "Имя должно содержать минимум 3 символа"),
  lastName: z
    .string()
    .min(3, "Фамилия должна содержать минимум 3 символа")
    .or(z.literal("")),
});

export const settingsSchema = z.object({
  username: z.string().regex(USERNAME_REGEX, USERNAME_MESSAGE),
  firstName: z.string().trim().min(1, "Требуется имя").max(50),
  lastName: z.string().trim().max(50, "Максимум 50 символов").optional(),
  avatarUrl: z.string().optional(),
  shareSubscriptions: z
    .enum(["ALL", "SUBS", "NONE"])
    .default("NONE")
    .optional(),
  shareFollowers: z.enum(["ALL", "SUBS", "NONE"]).default("NONE").optional(),
  shareStats: z.enum(["ALL", "SUBS", "NONE"]).default("NONE").optional(),
  hideActivity: z.boolean(),
});

export const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  pages: z.coerce.number<number>().min(1),
  description: z.string().optional(),
  coverUrl: z.string().optional(),
  fields: z.array(
    z.object({
      title: z.string({ error: "Название поля обязательно" }),
      value: z.string({
        error: "Значение поля обязательно",
      }),
    }),
  ),
});

const resetBookSchema = z
  .object({
    title: z.string().trim().min(1, "Укажите точное название книги"),
    author: z.string().trim().optional(),
    pages: z.coerce.number<number>().int().min(1).optional(),
  })
  .superRefine((book, ctx) => {
    if (!book.author && book.pages === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["author"],
        message: "Укажите автора или количество страниц",
      });
    }
  });

export const resetPasswordSchema = z
  .object({
    username: z.string().trim().min(1, "Введите имя пользователя"),
    password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
    confirmPassword: z.string().min(1, "Повторите пароль"),
    book1: resetBookSchema,
    book2: resetBookSchema,
    book3: resetBookSchema,
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли не совпадают",
  });
