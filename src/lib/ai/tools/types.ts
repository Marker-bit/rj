import { JSONValue } from "ai";
import { LucideIcon } from "lucide-react";

export type ToolView<
  INPUT extends JSONValue | unknown | never = never,
  OUTPUT extends JSONValue | unknown | never = never,
> = {
  texts: {
    loadingText: string;
    successText: string;
    approvalText: string;
    acceptedText?: string;
    deniedText?: string;
  };
  icon: LucideIcon;
  outputView: ToolOutputView<INPUT, OUTPUT>;
};

export type ToolOutputView<
  INPUT extends JSONValue | unknown | never = never,
  OUTPUT extends JSONValue | unknown | never = never,
> = React.FC<{ input: INPUT; output: OUTPUT }>;
