import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toolViews } from "@/lib/ai/tools/toolset";
import { ChatStatus } from "ai";
import { CheckIcon, SendIcon, WrenchIcon } from "lucide-react";
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
  const [allowedTools, setAllowedTools] = useState<string[]>(
    Object.keys(toolViews),
  );
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon-sm" variant="ghost" type="button">
            <WrenchIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Разрешенные инструменты</DropdownMenuLabel>
            {Object.entries(toolViews).map(([key, value]) => (
              <DropdownMenuItem
                className="grid grid-cols-[1fr_1rem] items-center gap-4"
                key={key}
                onClick={(evt) => {
                  evt.preventDefault();
                  if (allowedTools.includes(key)) {
                    setAllowedTools(
                      allowedTools.filter((tool) => tool !== key),
                    );
                  } else {
                    setAllowedTools([...allowedTools, key]);
                  }
                }}
              >
                <span className="flex items-center gap-2">
                  <value.icon className="size-4 opacity-72" />
                  <span className="truncate">{value.title}</span>
                </span>
                {allowedTools.includes(key) && <CheckIcon className="size-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
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
