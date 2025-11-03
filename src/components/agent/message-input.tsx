import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import { useState } from "react";

export function MessageInput({
  onSend,
}: {
  onSend: (message: string) => void;
}) {
  const [message, setMessage] = useState("");
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
      <Button size="icon-sm" type="submit">
        <SendIcon />
      </Button>
    </form>
  );
}
