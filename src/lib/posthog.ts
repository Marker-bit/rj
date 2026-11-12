type PostHogClient = (typeof import("posthog-js"))["default"];

type Properties = Record<string, unknown>;

let client: PostHogClient | null = null;
let loadPromise: Promise<PostHogClient | null> | null = null;

/**
 * Loads and initializes PostHog on demand so `posthog-js` stays out of the
 * initial client bundle. Safe to call multiple times.
 */
export function initPostHog(): Promise<PostHogClient | null> {
  if (loadPromise) {
    return loadPromise;
  }

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

  if (!key) {
    loadPromise = Promise.resolve(null);
    return loadPromise;
  }

  loadPromise = import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        defaults: "2025-11-30",
      });
      client = posthog;
      return posthog;
    })
    .catch(() => null);

  return loadPromise;
}

async function getClient() {
  return client ?? initPostHog();
}

export async function capture(event: string, properties?: Properties) {
  const posthog = await getClient();
  posthog?.capture(event, properties);
}

export async function identify(id: string, properties?: Properties) {
  const posthog = await getClient();
  posthog?.identify(id, properties);
}
