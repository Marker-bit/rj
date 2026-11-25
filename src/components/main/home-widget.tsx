"use client";

import type { ReactNode } from "react";
import { useHomeWidget } from "@/hooks/use-journal-preferences";

export function HomeWidget({
  widget,
  children,
}: {
  widget: Parameters<typeof useHomeWidget>[0];
  children: ReactNode;
}) {
  const [visible] = useHomeWidget(widget);
  return visible ? children : null;
}
