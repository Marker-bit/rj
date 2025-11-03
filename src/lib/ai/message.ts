import { toolSetForUser } from "@/lib/ai/tools/toolset";
import { InferUITools, UIDataTypes, UIMessage } from "ai";

export type MyUIMessage = UIMessage<
  unknown,
  UIDataTypes,
  InferUITools<ReturnType<typeof toolSetForUser>>
>;
