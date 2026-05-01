import { cn } from "@/lib/utils";
import styles from "./loader.module.css";

const spinnerBars = Array.from({ length: 12 }, (_, index) => `bar-${index}`);

export function Loader({
  className,
  invert,
  white,
}: {
  className: string;
  invert?: boolean;
  white?: boolean;
}) {
  return (
    <div className={`like-svg ${className}`}>
      <div className={styles.sonnerspinner}>
        {spinnerBars.map((bar) => (
          <div
            className={cn(
              styles.sonnerloadingbar,
              white
                ? "bg-white"
                : invert
                  ? "bg-white dark:bg-black"
                  : "bg-black dark:bg-white",
            )}
            key={bar}
          />
        ))}
      </div>
    </div>
  );
}
