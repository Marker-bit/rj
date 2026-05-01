"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const VercelAnalytics = dynamic(
  () =>
    import("@vercel/analytics/react").then((mod) => ({
      default: mod.Analytics,
    })),
  { ssr: false },
);

const VercelSpeedInsights = dynamic(
  () =>
    import("@vercel/speed-insights/next").then((mod) => ({
      default: mod.SpeedInsights,
    })),
  { ssr: false },
);

const UmamiAnalytics = dynamic(() => import("@/components/umami-analytics"), {
  ssr: false,
});

const schedule = (callback: () => void) => {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback);
    return;
  }

  setTimeout(callback, 1);
};

export function Analytics({ isVercel }: { isVercel: boolean }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    schedule(() => setReady(true));
  }, []);

  if (!ready) {
    return null;
  }

  if (isVercel) {
    return (
      <>
        <VercelAnalytics />
        <VercelSpeedInsights />
      </>
    );
  }

  return (
    <UmamiAnalytics
      dryRun={process.env.NODE_ENV === "development"}
      debug={process.env.NODE_ENV === "development"}
      websiteId={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
      src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
    />
  );
}
