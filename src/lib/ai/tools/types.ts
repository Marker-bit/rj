import type { InferToolInput, InferToolOutput } from "ai";
import type { LucideIcon } from "lucide-react";
import type { toolSetForUser } from "@/lib/ai/tools/toolset";

export type AllTools = ReturnType<typeof toolSetForUser>;
export type ToolId = keyof AllTools;

export type ToolView<ToolName extends ToolId = ToolId> = {
  texts: {
    loadingText: string;
    successText: string;
    approvalText: string;
    acceptedText?: string;
    deniedText?: string;
  };
  title: string;
  icon: LucideIcon;
  outputView: ToolOutputView<ToolName>;
};

export type ToolOutputView<ToolName extends ToolId> = React.FC<{
  input: ToolInput<ToolName>;
  output: ToolOutput<ToolName>;
}>;

export type ToolInput<ToolName extends ToolId> = InferToolInput<
  AllTools[ToolName]
>;
export type ToolOutput<ToolName extends ToolId> = InferToolOutput<
  AllTools[ToolName]
>;
