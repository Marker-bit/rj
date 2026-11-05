import { type ChatAddToolApproveResponseFunction, isTextUIPart } from "ai";
import { Fragment } from "react";
import { Streamdown } from "streamdown";
import { MessageContextMenu } from "@/components/agent/message/message-context-menu";
import { ToolCall } from "@/components/agent/tool-call";
import {
  groupMessageParts,
  type KnownEntities,
  type MyUIMessage,
} from "@/lib/ai/message";
import { toolViews } from "@/lib/ai/tools/tool-views";
import type { ToolId } from "@/lib/ai/tools/types";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  Message as MessageRoot,
  MessageContent,
} from "@/components/ui/message";

export function Message({
  message,
  knownEntities,
  ref,
  onRegenerate,
  addToolApprovalResponse,
  onAnswer,
  isStreaming,
  isLastMessage,
  canRegenerate,
}: {
  message: MyUIMessage;
  knownEntities?: KnownEntities;
  ref?: React.RefObject<HTMLDivElement>;
  onRegenerate: () => void;
  addToolApprovalResponse: ChatAddToolApproveResponseFunction;
  onAnswer: (args: {
    toolCallId: string;
    answer: string;
    label: string;
  }) => void;
  isStreaming: boolean;
  isLastMessage: boolean;
  canRegenerate: boolean;
}) {
  const partGroups = groupMessageParts(message);
  if (partGroups.length === 0) {
    return null;
  }

  const isUser = message.role === "user";
  let textGroupNumber = 0;

  const content = partGroups.map((partGroup, idx) => {
    if (!Array.isArray(partGroup) && isTextUIPart(partGroup)) {
      const textKey = `text-${message.id}-${textGroupNumber}`;
      textGroupNumber += 1;

      if (isUser) {
        return (
          <p
            key={textKey}
            data-message-text-part={textGroupNumber}
            className="whitespace-pre-wrap"
          >
            {partGroup.text}
          </p>
        );
      }

      return (
        <div
          key={textKey}
          data-message-text-part={textGroupNumber}
          className={idx !== 0 ? "mt-2" : undefined}
        >
          <Streamdown isAnimating={isStreaming}>{partGroup.text}</Streamdown>
        </div>
      );
    }

    if (Array.isArray(partGroup)) {
      return (
        <Fragment
          key={`tools-${message.id}-${partGroup[0]?.toolCallId ?? idx}`}
        >
          <div className="flex flex-col gap-3">
            {partGroup.map((part) => {
              const toolName = part.type.slice(5);
              if (!(toolName in toolViews)) return null;
              const toolView = toolViews[toolName as ToolId];

              return (
                <ToolCall
                  key={part.toolCallId}
                  toolName={toolName as ToolId}
                  toolView={toolView}
                  toolCall={part}
                  knownEntities={knownEntities}
                  addToolApprovalResponse={addToolApprovalResponse}
                  onAnswer={onAnswer}
                  isLastMessage={isLastMessage}
                />
              );
            })}
          </div>
        </Fragment>
      );
    }

    return null;
  });

  return (
    <MessageContextMenu
      message={message}
      canRegenerate={canRegenerate}
      isStreaming={isStreaming}
      onRegenerate={onRegenerate}
      className="flex w-full flex-col"
    >
      <MessageRoot align={isUser ? "end" : "start"} ref={ref}>
        <MessageContent className={isUser ? undefined : "gap-3"}>
          {isUser ? (
            <Bubble align="end" variant="muted">
              <BubbleContent className="flex flex-col gap-2">
                {content}
              </BubbleContent>
            </Bubble>
          ) : (
            content
          )}
        </MessageContent>
      </MessageRoot>
    </MessageContextMenu>
  );
}
