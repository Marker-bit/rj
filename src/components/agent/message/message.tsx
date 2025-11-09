import { MessageContainer } from "@/components/agent/message/message-container";
import { MessageContextMenu } from "@/components/agent/message/message-context-menu";
import { MessageRole } from "@/components/agent/message/message-role";
import { ToolCall } from "@/components/agent/tool-call";
import { groupMessageParts, MyUIMessage } from "@/lib/ai/message";
import { toolViews } from "@/lib/ai/tools/toolset";
import { ToolId } from "@/lib/ai/tools/types";
import { cn } from "@/lib/utils";
import {
  ChatAddToolApproveResponseFunction,
  isTextUIPart,
  isToolUIPart,
} from "ai";
import { useMemo } from "react";
import { Streamdown } from "streamdown";

export function Message({
  message,
  ref,
  onRegenerate,
  addToolApprovalResponse,
  isStreaming,
}: {
  message: MyUIMessage;
  ref?: React.RefObject<HTMLDivElement>;
  onRegenerate: () => void;
  addToolApprovalResponse: ChatAddToolApproveResponseFunction;
  isStreaming: boolean;
}) {
  // const toolParts = useMemo(() => {
  //   return message.parts.filter((part) => isToolUIPart(part));
  // }, [message.parts]);
  // const textPart = useMemo(() => {
  //   return message.parts.find((part) => part.type === "text");
  // }, [message.parts]);

  const partGroups = groupMessageParts(message);

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
          {partGroups.map((partGroup, idx) => {
            if (!Array.isArray(partGroup) && isTextUIPart(partGroup)) {
              const previousParts = partGroups.slice(0, idx);
              const hasToolPartsBefore = previousParts.some(Array.isArray);

              return (
                <Streamdown
                  key={idx}
                  isAnimating={isStreaming}
                  className={cn(hasToolPartsBefore && "mt-2")}
                >
                  {partGroup.text}
                </Streamdown>
              );
            }
            if (Array.isArray(partGroup)) {
              return partGroup.map((part, index) => {
                const toolName = part.type.slice(5);
                if (!(toolName in toolViews)) return null;
                const toolView = toolViews[toolName as ToolId];

                return (
                  <ToolCall
                    key={part.toolCallId}
                    toolView={toolView}
                    isLast={index === partGroup.length - 1}
                    toolCall={part}
                    addToolApprovalResponse={addToolApprovalResponse}
                  />
                );
              });
            }
          })}
          {/*<p
            className={cn(
              "whitespace-pre-wrap",
              toolParts.length > 0 && "mt-2",
            )}
          >
            {textPart?.text}
          </p>*/}

          {/*<MessageActions message={message} />*/}
        </MessageContainer>
      </MessageContextMenu>
    </div>
  );
}
