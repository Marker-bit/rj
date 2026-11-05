import { ru } from "date-fns/locale";
import type * as React from "react";
import { Calendar } from "@/components/ui/calendar";

/**
 * Calendar with the app-wide defaults: Russian locale, Monday as the first day
 * of the week and dropdown month/year navigation so distant dates stay reachable.
 */
export function DateCalendar({
  captionLayout = "dropdown",
  ...props
}: React.ComponentProps<typeof Calendar>) {
  return (
    <Calendar
      locale={ru}
      weekStartsOn={1}
      captionLayout={captionLayout}
      {...props}
    />
  );
}
