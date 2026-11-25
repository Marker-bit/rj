import { BarChartBig, Book, LibraryBig, UserRound, Users } from "lucide-react";
import { z } from "zod";

const exportTypes = z.enum([
  "books",
  "groups",
  "journal",
  "collections",
  "profile",
]);

const exportItems = {
  books: { label: "Книги", Icon: Book },
  groups: { label: "Группы", Icon: Users },
  journal: { label: "Журнал", Icon: BarChartBig },
  collections: { label: "Коллекции", Icon: LibraryBig },
  profile: { label: "Профиль и приватность", Icon: UserRound },
} satisfies Record<
  z.infer<typeof exportTypes>,
  { label: string; Icon: typeof Book }
>;

export const exportDataSchema = z.object({
  data: z.array(exportTypes).min(1).max(exportTypes.options.length),
  format: z.enum(["json", "yaml"]),
});

export const exportDefaultItems = exportTypes.options.map((value) => ({
  value,
  ...exportItems[value],
  defaultChecked: value === "books",
}));
