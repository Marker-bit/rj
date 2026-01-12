"use client";

import { useState } from "react";
import { AgentPopover } from "@/components/agent/agent-popover";
import { AgentToggle } from "@/components/agent/agent-toggle";

export function Agent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="flex flex-col gap-2 fixed bottom-4 right-4 items-end data-[hidden]:pointer-events-none z-[99]"
      data-hidden={!isOpen || undefined}
    >
      <AgentPopover isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <AgentToggle
        isOpen={isOpen}
        onClick={(evt) => {
          evt.stopPropagation();
          setIsOpen(!isOpen);
        }}
      />
    </div>
  );
}
