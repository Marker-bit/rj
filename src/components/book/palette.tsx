"use client";

import { BackgroundColor } from "@/generated/prisma/enums";
import { Check, PaletteIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { setBookColor } from "@/lib/actions/books";
import { backgroundColors } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { revalidate } from "@/lib/actions/revalidate";

export default function Palette({
  background,
  bookId,
}: {
  background: BackgroundColor;
  bookId: string;
}) {
  const [chosenBackground, setChosenBackground] =
    useState<BackgroundColor>(background);
  const [loading, setLoading] = useState(false);

  const setColor = (color: BackgroundColor) => {
    if (loading) return;
    setChosenBackground(color);
  };

  const updateColor = async (color: BackgroundColor) => {
    setLoading(true);
    await setBookColor(bookId, color);
    setLoading(false);
    toast.success("Цвет изменён");
    void revalidate("books");
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" aria-label="Цвет книги">
          <PaletteIcon className="size-4" />
          <div className="max-sm:hidden">Цвет</div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="overflow-hidden">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="flex items-center rounded-xl border p-2"
            aria-label="Без цвета"
            aria-pressed={chosenBackground === BackgroundColor.NONE}
            onClick={() => setColor(BackgroundColor.NONE)}
          >
            <div className="size-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            {chosenBackground === BackgroundColor.NONE && (
              <Check className="ml-2 size-4" />
            )}
          </button>
          {backgroundColors.map((color) => (
            <button
              type="button"
              className="flex items-center rounded-xl border p-2"
              aria-label={color.label}
              aria-pressed={chosenBackground === color.type}
              onClick={() => setColor(color.type)}
              key={color.type}
            >
              <div className={cn("size-8 rounded-lg", color.color)} />
              {chosenBackground === color.type && (
                <Check className="ml-2 size-4" />
              )}
            </button>
          ))}
        </div>
        {chosenBackground !== background && (
          <Button
            className="mt-2 flex w-full items-center justify-center"
            disabled={loading}
            onClick={() => updateColor(chosenBackground)}
          >
            Сохранить
          </Button>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          Изменить цвет этой книги (цветные книги будут показываться в самом
          верху списка)
        </p>
      </PopoverContent>
    </Popover>
  );
}
