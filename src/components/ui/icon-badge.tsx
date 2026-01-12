import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function IconBadge({
  icon: Icon,
  children,
  ...props
}: React.ComponentProps<typeof Badge> & { icon: LucideIcon }) {
  return (
    <Badge {...props} className="flex items-center gap-1">
      <Icon className="-ms-0.5 opacity-60 size-3" aria-hidden="true" />
      {children}
    </Badge>
  );
}
