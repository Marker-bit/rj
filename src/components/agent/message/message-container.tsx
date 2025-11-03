import { cn } from "@/lib/utils";

export function MessageContainer({
  children,
  className,
  role,
  ...props
}: {
  children: React.ReactNode;
  role: "user" | "system" | "assistant";
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        role === "user" &&
          "bg-primary text-primary-foreground rounded-md rounded-tr-none px-2 py-1 min-w-[30%]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
