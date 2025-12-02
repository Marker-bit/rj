import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .regex(
      /^[a-zA-Z0-9_.-]{3,15}$/,
      "Имя пользователя должно быть буквенно-цифровой строкой, которая может включать в себя _, . и -, длиной от 3 до 16 символов.",
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
