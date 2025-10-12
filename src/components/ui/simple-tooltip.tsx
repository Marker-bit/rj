import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SimpleTooltip({
  text,
  children,
  asChild = true,
  ...props
}: React.ComponentProps<typeof TooltipContent> & {
  text: string;
  asChild?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent {...props}>{text}</TooltipContent>
    </Tooltip>
  );
}
