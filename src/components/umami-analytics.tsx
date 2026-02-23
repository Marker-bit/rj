"use client";

import dynamic from "next/dynamic";

// Dynamically import UmamiAnalytics with SSR disabled
const UmamiAnalytics = dynamic(
  () =>
    import("@giof/react-umami").then((mod) => ({
      default: mod.UmamiAnalytics,
    })),
  {
    ssr: false,
    loading: () => null,
  },
);

interface ClientUmamiAnalyticsProps {
  websiteId?: string;
  src?: string;
  domains?: string[];
  autoTrack?: boolean;
  dryRun?: boolean;
  debug?: boolean;
}

export default function ClientUmamiAnalytics(props: ClientUmamiAnalyticsProps) {
  return <UmamiAnalytics {...props} />;
}
