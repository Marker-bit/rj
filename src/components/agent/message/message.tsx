import { MessageActions } from "@/components/agent/message/message-actions";
import { MessageContainer } from "@/components/agent/message/message-container";
import { MessageContextMenu } from "@/components/agent/message/message-context-menu";
import { MessageRole } from "@/components/agent/message/message-role";
import { ToolCall } from "@/components/agent/tool-call";
import { MyUIMessage } from "@/lib/ai/message";
import { toolViews } from "@/lib/ai/tools/toolset";
import { cn } from "@/lib/utils";
import { isToolUIPart } from "ai";
import { useMemo } from "react";

export function Message({
  message,
  ref,
  onRegenerate,
}: {
  message: MyUIMessage;
  ref?: React.RefObject<HTMLDivElement>;
  onRegenerate: () => void;
}) {
  const toolParts = useMemo(() => {
    return message.parts.filter((part) => isToolUIPart(part));
  }, [message.parts]);
  const textPart = useMemo(() => {
    return message.parts.find((part) => part.type === "text");
  }, [message.parts]);

  return (
    <div
      className={cn(
        "flex w-full pb-2",
        message.role === "user"
          ? "justify-end origin-top-right"
          : "justify-start origin-top-left",
      )}
      ref={ref}
    >
      <MessageContextMenu message={message} onRegenerate={onRegenerate}>
        <MessageContainer
          role={message.role}
          className="group relative flex flex-col"
        >
          <MessageRole role={message.role} />
          {toolParts.map((part, idx) => {
            const toolName = part.type.slice(5);
            const toolView = toolName in toolViews ? toolViews[toolName] : null;
            if (!toolView) return null;

            return (
              <ToolCall
                key={part.toolCallId}
                header={
                  part.state === "output-available"
                    ? toolView.texts.successText
                    : toolView.texts.loadingText
                }
                icon={toolView.icon}
                isLast={idx === toolParts.length - 1}
                state={
                  part.state === "output-available" ? "success" : "loading"
                }
              />
            );
          })}
          <p
            className={cn(
              "whitespace-pre-wrap",
              toolParts.length > 0 && "mt-2",
            )}
          >
            {textPart?.text}
          </p>

          {/*<MessageActions message={message} />*/}
        </MessageContainer>
      </MessageContextMenu>
    </div>
  );
}
