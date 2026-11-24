"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Pencil } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import {
  CollectionIconTile,
  CollectionMark,
} from "@/components/book/collection-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateCollection } from "@/lib/actions/collections";
import {
  collectionColors,
  collectionIcons,
  isCollectionIcon,
  type CollectionIcon,
} from "@/lib/collection-appearance";

type EditableCollection = {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
};

export function CollectionEditPopover({
  collection,
}: {
  collection: EditableCollection;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-md"
          aria-label={`Редактировать коллекцию «${collection.name}»`}
        >
          <Pencil aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="z-60 w-80 max-w-[calc(100vw-1rem)] max-h-(--radix-popover-content-available-height) overflow-y-auto"
        aria-label="Редактирование коллекции"
      >
        <CollectionEditForm
          collection={collection}
          onClose={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}

function CollectionEditForm({
  collection,
  onClose,
}: {
  collection: EditableCollection;
  onClose: () => void;
}) {
  const [name, setName] = useState(collection.name);
  const [icon, setIcon] = useState<CollectionIcon>(
    isCollectionIcon(collection.icon) ? collection.icon : "tag",
  );
  const [color, setColor] = useState(
    collectionColors.find(({ value }) => value === collection.color)?.value ??
      null,
  );
  const nameId = useId();
  const queryClient = useQueryClient();

  const save = useMutation({
    mutationFn: () =>
      updateCollection({
        id: collection.id,
        name,
        icon: icon === "tag" ? null : icon,
        color,
      }),
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error);
        return;
      }
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      void queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success(result.message);
      onClose();
    },
    onError: () => toast.error("Не удалось обновить коллекцию"),
  });

  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (name.trim() && !save.isPending) save.mutate();
      }}
    >
      <label htmlFor={nameId} className="grid gap-1 text-sm font-medium">
        Название
        <Input
          id={nameId}
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={save.isPending}
          required
        />
      </label>

      <fieldset className="min-w-0" disabled={save.isPending}>
        <legend className="mb-1 text-sm font-medium">
          Значок: {collectionIcons[icon].label}
        </legend>
        <div className="flex max-h-36 flex-wrap content-start gap-1 overflow-y-auto p-1">
          {Object.entries(collectionIcons).map(
            ([value, { icon: Icon, label }]) => (
              <Button
                key={value}
                type="button"
                size="icon-sm"
                variant="ghost"
                className="rounded-md aria-pressed:bg-muted aria-pressed:border-border"
                aria-label={label}
                aria-pressed={value === icon}
                title={label}
                onClick={() => {
                  if (isCollectionIcon(value)) setIcon(value);
                }}
              >
                <Icon aria-hidden="true" />
              </Button>
            ),
          )}
        </div>
      </fieldset>

      <fieldset className="min-w-0" disabled={save.isPending}>
        <legend className="mb-1 text-sm font-medium">Цвет</legend>
        <div className="flex flex-wrap gap-1">
          {collectionColors.map(({ value, label }) => (
            <Button
              key={value}
              type="button"
              size="icon-sm"
              variant="ghost"
              className="rounded-md aria-pressed:bg-muted aria-pressed:border-border"
              aria-label={label}
              aria-pressed={color === value}
              title={label}
              onClick={() => setColor(color === value ? null : value)}
            >
              <span
                className="grid size-5 place-items-center rounded-full text-white"
                style={{ backgroundColor: value }}
              >
                {color === value && (
                  <Check className="size-3" aria-hidden="true" />
                )}
              </span>
            </Button>
          ))}
        </div>
      </fieldset>

      <div className="flex items-center justify-end gap-2">
        <CollectionIconTile icon={icon} color={color} className="size-9" />
        <div className="grid size-9 shrink-0 place-items-center text-muted-foreground">
          <CollectionMark icon={icon} color={color} className="size-5" />
        </div>
        <Button type="submit" disabled={!name.trim() || save.isPending}>
          Сохранить
        </Button>
      </div>
    </form>
  );
}
