"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent } from "@/components/ui/popover";

export function HelpButton({
  onClick,
  helpText,
  children,
  "aria-label": ariaLabel,
  ...props
}: Omit<React.ComponentPropsWithRef<typeof Button>, "onClick"> & {
  helpText: string;
  onClick: () => void;
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const pressStartTime = useRef<Date | null>(null);
  const longPressAt = useRef(0);

  const handlePressStart = () => {
    pressStartTime.current = new Date();
  };

  const handlePressEnd = () => {
    if (!pressStartTime.current) return;
    const pressDuration = Date.now() - pressStartTime.current.getTime();
    pressStartTime.current = null;

    if (pressDuration >= 500) {
      longPressAt.current = Date.now();
      setIsPopoverOpen(true);
    }
  };

  const handleMouseLeave = () => {
    pressStartTime.current = null;
  };

  const handleClick = () => {
    // Ignore the click that follows a long press; it opened the help popover.
    if (Date.now() - longPressAt.current < 500) return;
    onClick();
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverPrimitive.PopoverAnchor asChild>
        <Button
          onClick={handleClick}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          aria-label={ariaLabel}
          {...props}
        >
          {children}
        </Button>
      </PopoverPrimitive.PopoverAnchor>
      <PopoverContent className="w-80">
        <p className="text-sm text-muted-foreground">{helpText}</p>
      </PopoverContent>
    </Popover>
  );
}
