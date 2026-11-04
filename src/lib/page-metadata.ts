import type { Metadata } from "next";

export function pageMetadata(title: string): Metadata {
  return { title: `${title} — Читательский дневник` };
}
