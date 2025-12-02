import { use } from "react";
import { Agent } from "./agent";

export const AgentSuspense = ({
  aiEnabled,
}: {
  aiEnabled: Promise<boolean>;
}) => {
  const aiEnabledValue = use(aiEnabled);
  return aiEnabledValue ? <Agent /> : null;
};
