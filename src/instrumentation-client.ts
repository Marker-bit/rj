const schedule = (callback: () => void) => {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback);
    return;
  }

  setTimeout(callback, 1);
};

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (posthogKey) {
  schedule(async () => {
    const { default: posthog } = await import("posthog-js");

    posthog.init(posthogKey, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      defaults: "2025-11-30",
    });
  });
}
