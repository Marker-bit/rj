import { Button } from "@/components/ui/button";
import { ChatStatus } from "ai";
import { SendIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function MessageInput({
  onSend,
  status,
  setIsEmpty,
}: {
  onSend: (message: string) => void;
  status: ChatStatus;
  setIsEmpty: (isEmpty: boolean) => void;
}) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    setIsEmpty(message.length === 0);
  }, [message, setIsEmpty]);

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
      />
      <Button
        size="icon-sm"
        type="submit"
        disabled={status === "streaming" || status === "submitted"}
      >
        <SendIcon />
      </Button>
    </form>
  );
}
