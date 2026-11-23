import {
  collectionIcons,
  isCollectionColor,
  isCollectionIcon,
} from "@/lib/collection-appearance";

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
