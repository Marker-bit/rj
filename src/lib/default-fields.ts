/**
 * Default book fields are a client-side preference: the settings page writes
 * them to localStorage and both the manual book form and the AI agent read
 * them back.
 */
export const DEFAULT_FIELDS_STORAGE_KEY = "fields";

export function normalizeDefaultFields(values: unknown): string[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

export function readDefaultFields(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(DEFAULT_FIELDS_STORAGE_KEY);

    return normalizeDefaultFields(stored ? JSON.parse(stored) : []);
  } catch {
    return [];
  }
}
