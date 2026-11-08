import type { ChatStatus } from "ai";
import { SendIcon } from "lucide-react";
import { useImperativeHandle, useRef } from "react";
import { ToolSelector } from "@/components/agent/message-input/tool-selector";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";

export type MessageInputRef = {
  setMessage: (message: string) => void;
};

export function MessageInput({
  onSend,
  message,
  setMessage,
  status,
  ref,
}: {
  onSend: (message: string) => void;
  message: string;
  setMessage: (message: string) => void;
  status: ChatStatus;
  ref: React.RefObject<MessageInputRef | null>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const busy = status === "streaming" || status === "submitted";
  const canSend = !busy && message.trim().length > 0;

  useImperativeHandle(ref, () => ({
    setMessage: (nextMessage: string) => {
      inputRef.current?.focus();
      setMessage(nextMessage);
    },
  }));

  return (
    <form
      ref={formRef}
      className="shrink-0 border-t p-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSend) {
          return;
        }
        onSend(message.trim());
        setMessage("");
      }}
    >
      <InputGroup>
        <InputGroupTextarea
          ref={inputRef}
          className="max-h-32 min-h-10 px-3 py-2"
          placeholder="Напишите сообщение..."
          value={message}
          rows={1}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
        />
        <InputGroupAddon align="block-end" className="pt-0">
          <ToolSelector />
          <InputGroupButton
            type="submit"
            variant="default"
            size="icon-sm"
            className="ml-auto"
            disabled={!canSend}
          >
            <SendIcon />
            <span className="sr-only">Отправить</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
