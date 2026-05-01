import { use } from "react";
import { LazyAgent } from "./lazy-agent";

export function AgentGate({ aiEnabled }: { aiEnabled: Promise<boolean> }) {
  return use(aiEnabled) ? <LazyAgent /> : null;
}
