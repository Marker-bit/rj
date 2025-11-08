import { Button } from "@/components/ui/button";
import { ChatStatus } from "ai";
import { SendIcon } from "lucide-react";
import { useEffect, useImperativeHandle, useRef, useState } from "react";

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
      className="flex gap-2 items-center border-t shrink-0 p-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSend(message);
        setMessage("");
      }}
    >
      <input
        className="flex-grow px-2 h-full outline-none"
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
