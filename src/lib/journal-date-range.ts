import { addDays, startOfDay } from "date-fns";
import type { DateRange } from "react-day-picker";

export function journalDateBounds(range: DateRange | undefined) {
  return {
    from: range?.from && new Date(startOfDay(range.from)).toISOString(),
    until:
      range?.to && new Date(startOfDay(addDays(range.to, 1))).toISOString(),
  };
}
