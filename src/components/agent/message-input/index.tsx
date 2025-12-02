import { ToolSelector } from "@/components/agent/message-input/tool-selector";
import { Button } from "@/components/ui/button";
import { ChatStatus } from "ai";
import { SendIcon } from "lucide-react";
import { useImperativeHandle, useRef, useState } from "react";
const items = [
  { label: "Next.js", value: "next" },
  { label: "Vite", value: "vite" },
  { label: "Astro", value: "astro" },
];

export type MessageInputRef = {
  setMessage: (message: string) => void;
};

export function MessageInput({
  onSend,
  status,
  ref,
}: {
  onSend: (message: string) => void;
  status: ChatStatus;
  ref: React.RefObject<MessageInputRef | null>;
}) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    setMessage: (message: string) => {
      inputRef.current?.focus();
      setMessage(message);
    },
  }));

  return (
    <form
      className="flex gap-2 items-center border-t shrink-0 p-2 overflow-hidden"
      onSubmit={(e) => {
        e.preventDefault();
        onSend(message);
        setMessage("");
      }}
    >
      <ToolSelector />
      <input
        className="flex-grow px-2 h-full outline-none min-w-0"
        placeholder="Напишите сообщение..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        ref={inputRef}
      />
      <Button
        size="icon-sm"
        type="submit"
        disabled={
          status === "streaming" ||
          status === "submitted" ||
          message.trim().length === 0
        }
      >
        <SendIcon />
      </Button>
    </form>
  );
}
