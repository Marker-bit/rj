import { fetchBooks } from "./books";

type FirstResult<T> = T extends [infer first, ...infer Rest] ? first : never;
type Book = Awaited<ReturnType<typeof fetchBooks>>[0];

declare global {
  namespace PrismaJson {
    type Field = { title: string; value: string }
    type Fields = Field[]
  }
}