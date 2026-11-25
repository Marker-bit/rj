// @vitest-environment jsdom
import { act, createElement } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { getReadingStats } from "./stats";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
const originalTZ = process.env.TZ;
function getStreak(events: Parameters<typeof getReadingStats>[0]["events"]) {
  return getReadingStats({
    events,
    now: new Date(),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }).streak;
}
let root: Root | undefined;
afterEach(async () => {
  if (root) await act(() => root?.unmount());
  root = undefined;
  if (originalTZ === undefined) delete process.env.TZ;
  else process.env.TZ = originalTZ;
  vi.useRealTimers();
  document.body.innerHTML = "";
});

it("reproduces a suppressed server streak remaining after hydration", async () => {
  vi.useFakeTimers({ now: new Date("2026-11-12T12:00:00Z") });
  const events = Array.from({ length: 984 }, (_, daysAgo) => {
    const readAt = new Date("2026-11-12T12:00:00Z");
    readAt.setUTCDate(readAt.getUTCDate() - daysAgo);
    if (daysAgo === 504) readAt.setTime(readAt.getTime() - 15 * 60 * 60 * 1000);
    return { readAt, bookId: "book", pagesRead: 1 };
  });
  function Badge() {
    return createElement(
      "button",
      { suppressHydrationWarning: true, type: "button" },
      createElement("svg"),
      getStreak(events),
    );
  }
  process.env.TZ = "UTC";
  const html = renderToString(createElement(Badge));
  document.body.innerHTML = `<div id="root">${html}</div>`;
  process.env.TZ = "Europe/Moscow";
  expect(getStreak(events)).toBe(984);
  const container = document.getElementById("root")!;
  await act(() => {
    root = hydrateRoot(container, createElement(Badge));
  });
  expect(container.textContent).toBe("504");
});

it("keeps all streak displays in sync after hydration and local midnight", async () => {
  vi.useFakeTimers({ now: new Date("2026-11-12T12:00:00Z") });
  const events = Array.from({ length: 984 }, (_, daysAgo) => {
    const readAt = new Date("2026-11-12T12:00:00Z");
    readAt.setUTCDate(readAt.getUTCDate() - daysAgo);
    if (daysAgo === 504) readAt.setTime(readAt.getTime() - 15 * 60 * 60 * 1000);
    return { readAt, bookId: "book", pagesRead: 1 };
  });
  const { StreakEventsProvider } =
    await import("@/components/main/streak-context");
  const { StreakInfo } = await import("@/components/main/streak-info");
  const { StreakButton } =
    await import("@/components/navigation/bars/streak-button");
  const { Stats } = await import("@/components/users/stats");
  const { TooltipProvider } = await import("@/components/ui/tooltip");
  const promise = Promise.resolve(events);
  Object.assign(promise, { status: "fulfilled", value: events });
  const app = (
    <StreakEventsProvider events={promise}>
      <TooltipProvider>
        <StreakButton />
        <StreakInfo />
        <Stats events={events} booksRead={0} />
      </TooltipProvider>
    </StreakEventsProvider>
  );
  process.env.TZ = "UTC";
  const html = renderToString(app);
  document.body.innerHTML = `<div id="root">${html}</div>`;
  process.env.TZ = "Europe/Moscow";
  const container = document.getElementById("root")!;
  await act(async () => {
    root = hydrateRoot(container, app);
  });
  expect(container.querySelector("button")?.textContent).toBe("984");
  expect(container.textContent).toContain("984 дня");
  expect(container.querySelector("#stats li")?.textContent).toBe(
    "Дней чтения подряд984",
  );

  await act(async () => {
    await vi.advanceTimersByTimeAsync(9 * 60 * 60 * 1000);
  });
  expect(container.querySelector("button")?.textContent).toBe("984");

  await act(async () => {
    await vi.advanceTimersByTimeAsync(24 * 60 * 60 * 1000);
  });
  expect(container.querySelector("button")?.textContent).toBe("0");
  expect(container.textContent).toContain("0 дней");
  expect(container.querySelector("#stats li")?.textContent).toBe(
    "Дней чтения подряд0",
  );
});
