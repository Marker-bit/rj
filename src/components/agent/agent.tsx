"use client";

import { useRef, useState } from "react";
import { AgentPopover } from "@/components/agent/agent-popover";
import { AgentToggle } from "@/components/agent/agent-toggle";

export function Agent() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="flex flex-col gap-2 fixed bottom-4 right-4 items-end data-hidden:pointer-events-none z-99 max-sm:data-open:inset-0 max-sm:data-open:bottom-0 max-sm:data-open:right-0 max-sm:data-open:items-stretch"
      data-hidden={!isOpen || undefined}
      data-open={isOpen || undefined}
    >
      <AgentPopover
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          triggerRef.current?.focus();
        }}
      />
      <AgentToggle
        ref={triggerRef}
        isOpen={isOpen}
        onClick={(evt) => {
          evt.stopPropagation();
          evt.currentTarget.focus();
          setIsOpen(!isOpen);
        }}
      />
    </div>
  );
}
