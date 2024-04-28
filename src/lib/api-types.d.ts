import { fetchBooks } from "./books";

type FirstResult<T> = T extends [infer first, ...infer Rest] ? first : never;
type Book = Awaited<ReturnType<typeof fetchBooks>>[0];
