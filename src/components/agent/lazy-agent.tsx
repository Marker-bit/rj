"use client";

import dynamic from "next/dynamic";

const Agent = dynamic(
  () => import("@/components/agent/agent").then((mod) => mod.Agent),
  {
    loading: () => null,
    ssr: false,
  },
);

export function LazyAgent() {
  return <Agent />;
}
