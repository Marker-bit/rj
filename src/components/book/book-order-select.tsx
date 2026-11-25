"use client";

import { Calendar, Percent } from "lucide-react";
import { useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isBookOrder, type BookOrder } from "@/lib/book-order";

export function BookOrderSelect({
  sort,
  onChange,
}: {
  sort: BookOrder;
  onChange: (value: BookOrder) => void;
}) {
  const id = useId();

  return (
    <div className="group relative w-full">
      <label
        htmlFor={id}
        className="bg-background text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50"
      >
        Сортировка
      </label>
      <Select
        value={sort}
        onValueChange={(value) => {
          if (isBookOrder(value)) onChange(value);
        }}
      >
        <SelectTrigger
          id={id}
          className="[&>span_svg]:text-muted-foreground [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 w-full"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground [&_*[role=option]>span]:flex [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
          <SelectItem value="percent">
            <Percent size={16} aria-hidden="true" />
            <span className="truncate">По прогрессу в книге</span>
          </SelectItem>
          <SelectItem value="activity">
            <Calendar size={16} aria-hidden="true" />
            <span className="truncate">По последней активности</span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
