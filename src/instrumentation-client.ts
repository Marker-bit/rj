import { initPostHog } from "@/lib/posthog";

const schedule = (callback: () => void) => {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback);
    return;
  }

  setTimeout(callback, 1);
};

if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  schedule(() => {
    void initPostHog();
  });
}
