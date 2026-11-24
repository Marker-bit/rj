import {
  collectionIcons,
  isCollectionColor,
  isCollectionIcon,
} from "@/lib/collection-appearance";
import { cn } from "@/lib/utils";

export function CollectionMark({
  icon,
  color,
  className,
}: {
  icon: string | null;
  color: string | null;
  className?: string;
}) {
  const Icon = collectionIcons[isCollectionIcon(icon) ? icon : "tag"].icon;

  return (
    <Icon
      aria-hidden="true"
      className={className}
      style={isCollectionColor(color) ? { color } : undefined}
    />
  );
}

export function CollectionIconTile({
  icon,
  color,
  className,
}: {
  icon: string | null;
  color: string | null;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground",
        className,
      )}
      style={
        isCollectionColor(color)
          ? {
              backgroundColor: `color-mix(in srgb, ${color} 16%, var(--background))`,
            }
          : undefined
      }
    >
      <CollectionMark icon={icon} color={color} className="size-5" />
    </div>
  );
}
