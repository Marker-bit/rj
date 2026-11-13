export type BookField = { title: string; value: string };

export function parseBookFields(value: unknown): BookField[] {
  if (Array.isArray(value)) {
    return value.filter(
      (field): field is BookField =>
        typeof field === "object" &&
        field !== null &&
        typeof (field as BookField).title === "string" &&
        typeof (field as BookField).value === "string",
    );
  }
  if (typeof value !== "string" || value.trim() === "") {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parseBookFields(parsed) : [];
  } catch {
    return [];
  }
}
