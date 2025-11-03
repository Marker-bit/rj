"use client";

import { AgentPopover } from "@/components/agent/agent-popover";
import { AgentToggle } from "@/components/agent/agent-toggle";
import { useState } from "react";

export function Agent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 fixed bottom-4 right-4 items-end">
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
