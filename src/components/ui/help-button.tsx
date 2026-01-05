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
  ...props
}: Omit<React.ComponentPropsWithRef<typeof Button>, "onClick"> & {
  helpText: string;
  onClick: () => void;
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const pressStartTime = useRef<Date | null>(null);

  const handleMouseDown = () => {
    pressStartTime.current = new Date();
  };

  const handleMouseUp = () => {
    if (pressStartTime.current) {
      const pressDuration = Date.now() - pressStartTime.current.getTime();
      pressStartTime.current = null;

      if (pressDuration >= 500) {
        setIsPopoverOpen(true);
      } else {
        onClick();
      }
    }
  };

  const handleMouseLeave = () => {
    pressStartTime.current = null;
  };

  const handleTouchStart = () => {
    pressStartTime.current = new Date();
  };

  const handleTouchEnd = () => {
    if (pressStartTime.current) {
      const pressDuration = Date.now() - pressStartTime.current.getTime();
      pressStartTime.current = null;

      if (pressDuration >= 500) {
        setIsPopoverOpen(true);
      } else {
        onClick();
      }
    }
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverPrimitive.PopoverAnchor asChild>
        <Button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
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
