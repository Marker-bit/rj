"use client";

import { formatDateRange } from "little-date";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Calendar30() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 5, 4),
    to: new Date(2025, 5, 10),
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="dates"
          className="w-56 justify-between font-normal"
        >
          {range?.from && range?.to
            ? formatDateRange(range.from, range.to, {
                includeTime: false,
                
              })
            : "Выберите дату"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="range"
          selected={range}
          captionLayout="dropdown"
          onSelect={(range) => {
            setRange(range);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
