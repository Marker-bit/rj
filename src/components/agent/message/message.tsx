import { type ChatAddToolApproveResponseFunction, isTextUIPart } from "ai";
import { Fragment } from "react";
import { Streamdown } from "streamdown";
import { MessageContainer } from "@/components/agent/message/message-container";
import { MessageContextMenu } from "@/components/agent/message/message-context-menu";
import { MessageRole } from "@/components/agent/message/message-role";
import { ToolCall } from "@/components/agent/tool-call";
import { groupMessageParts, type MyUIMessage } from "@/lib/ai/message";
import { toolViews } from "@/lib/ai/tools/tool-views";
import type { ToolId } from "@/lib/ai/tools/types";
import { cn } from "@/lib/utils";
import { Bubble, BubbleContent } from "@/components/ui/bubble";

export function Message({
  message,
  ref,
  onRegenerate,
  addToolApprovalResponse,
  isStreaming,
  canRegenerate,
}: {
  message: MyUIMessage;
  ref?: React.RefObject<HTMLDivElement>;
  onRegenerate: () => void;
  addToolApprovalResponse: ChatAddToolApproveResponseFunction;
  isStreaming: boolean;
  canRegenerate: boolean;
}) {
  const partGroups = groupMessageParts(message);
  let textGroupNumber = 0;

  return (
    <div ref={ref} className="flex w-full flex-col">
      <MessageContextMenu
        message={message}
        canRegenerate={canRegenerate}
        onRegenerate={onRegenerate}
        className="flex w-full flex-col"
      >
        <Bubble
          align={message.role === "user" ? "end" : "start"}
          variant={message.role === "user" ? "default" : "muted"}
        >
          <BubbleContent>
            {partGroups.map((partGroup, idx) => {
              if (!Array.isArray(partGroup) && isTextUIPart(partGroup)) {
                const textKey = `text-${message.id}-${textGroupNumber}`;
                textGroupNumber += 1;

                return (
                  <Streamdown
                    key={textKey}
                    isAnimating={isStreaming}
                    className={idx !== 0 ? "mt-2" : ""}
                  >
                    {partGroup.text}
                  </Streamdown>
                );
              }
              if (Array.isArray(partGroup)) {
                return (
                  <Fragment
                    key={`tools-${partGroup
                      .map((part) => part.toolCallId)
                      .join("-")}`}
                  >
                    <div className="h-2" />
                    {partGroup.map((part, index) => {
                      const toolName = part.type.slice(5);
                      if (!(toolName in toolViews)) return null;
                      const toolView = toolViews[toolName as ToolId];

                      return (
                        <ToolCall
                          key={part.toolCallId}
                          toolName={toolName as ToolId}
                          toolView={toolView}
                          isLast={index === partGroup.length - 1}
                          toolCall={part}
                          addToolApprovalResponse={addToolApprovalResponse}
                        />
                      );
                    })}
                  </Fragment>
                );
              }
            })}
          </BubbleContent>
        </Bubble>
        {/*<MessageContainer
          role={message.role}
          className="group relative flex flex-col"
        >
          <MessageRole role={message.role} />
          <p
            className={cn(
              "whitespace-pre-wrap",
              toolParts.length > 0 && "mt-2",
            )}
          >
            {textPart?.text}
          </p>

          <MessageActions message={message} />
        </MessageContainer>*/}
      </MessageContextMenu>
    </div>
  );
}
