import { cn } from "@/lib/utils";
import styles from "./loader.module.css";

export function Loader({
  className,
  invert,
}: {
  className: string;
  invert?: boolean;
}) {
  return (
    <div className={className}>
      <div className={styles.sonnerspinner}>
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <div
              className={cn(
                styles.sonnerloadingbar,
                invert ? "bg-white dark:bg-black" : "bg-black dark:bg-white"
              )}
              key={`spinner-bar-${i}`}
            />
          ))}
      </div>
    </div>
  );
}
