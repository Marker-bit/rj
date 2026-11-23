import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId, useState } from "react";
import { toast } from "sonner";
import { CollectionMark } from "@/components/book/collection-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateCollectionAppearance } from "@/lib/actions/collections";
import {
  collectionIcons,
  isCollectionColor,
  isCollectionIcon,
  type CollectionIcon,
} from "@/lib/collection-appearance";

export function CollectionAppearanceEditor({
  collection,
  onClose,
}: {
  collection: { id: string; icon: string | null; color: string | null };
  onClose: () => void;
}) {
  const [icon, setIcon] = useState<CollectionIcon>(
    isCollectionIcon(collection.icon) ? collection.icon : "tag",
  );
  const [color, setColor] = useState(collection.color ?? "");
  const colorId = useId();
  const hexId = useId();
  const validColor = color === "" || isCollectionColor(color);
  const queryClient = useQueryClient();

  const save = useMutation({
    mutationFn: () =>
      updateCollectionAppearance({
        id: collection.id,
        icon: icon === "tag" ? null : icon,
        color: color || null,
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
    onError: () => toast.error("Не удалось сохранить оформление коллекции"),
  });

  return (
    <form
      className="grid gap-3 border-t p-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (validColor) save.mutate();
      }}
    >
      <fieldset className="grid gap-2" disabled={save.isPending}>
        <legend className="mb-1 text-sm font-medium">
          Значок: {collectionIcons[icon].label}
        </legend>
        <div className="grid max-h-44 grid-cols-6 gap-1 overflow-y-auto p-1 sm:grid-cols-10">
          {Object.entries(collectionIcons).map(
            ([value, { icon: Icon, label }]) => (
              <Button
                key={value}
                type="button"
                size="icon"
                variant={value === icon ? "default" : "outline"}
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

      <div className="flex flex-wrap items-end gap-2">
        <label htmlFor={colorId} className="grid gap-1 text-sm font-medium">
          Цвет
          <Input
            id={colorId}
            type="color"
            value={isCollectionColor(color) ? color : "#808080"}
            onChange={(event) => setColor(event.target.value)}
            className="w-14 p-1"
            disabled={save.isPending}
          />
        </label>
        <label htmlFor={hexId} className="grid gap-1 text-sm font-medium">
          HEX
          <Input
            id={hexId}
            value={color}
            placeholder="#805AD5"
            maxLength={7}
            onChange={(event) => setColor(event.target.value)}
            aria-invalid={!validColor}
            className="w-28"
            disabled={save.isPending}
          />
        </label>
        <Button
          type="button"
          variant="ghost"
          disabled={!color || save.isPending}
          onClick={() => setColor("")}
        >
          Сбросить цвет
        </Button>
      </div>
      {!validColor && (
        <p className="text-sm text-destructive">
          Введите цвет в формате #RRGGBB.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <CollectionMark icon={icon} color={color} className="size-5" />
        <Button type="submit" disabled={!validColor || save.isPending}>
          Сохранить оформление
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={save.isPending}
        >
          Отмена
        </Button>
      </div>
    </form>
  );
}
