"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const MainChart = dynamic(() => import("./main-chart"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-12 w-56" />
      <Skeleton className="h-44 w-full" />
      <Skeleton className="h-44 w-full" />
      <Skeleton className="h-44 w-full" />
    </div>
  ),
});

/**
 * Charts are the largest client dependency on the home page and sit below the
 * fold. Only fetch the chart bundle once the placeholder becomes visible.
 */
export function LazyMainChart({
  events,
  profile,
}: {
  events: any[];
  profile: any;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = containerRef.current;

    if (!element || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      {visible ? (
        <MainChart events={events} profile={profile} />
      ) : (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-56" />
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
      )}
    </div>
  );
}
