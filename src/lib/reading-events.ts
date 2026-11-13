export type ReadingEventLike = {
  id: string;
  pagesRead: number;
  readAt: Date | string;
};

const time = (value: Date | string) => new Date(value).getTime();

/**
 * Reading progress and "latest activity" are different questions:
 * - progress is the furthest page ever reached (monotonic display);
 * - latest is the most recently dated event (what the undo button deletes).
 */
export function getReadingState(events: readonly ReadingEventLike[]) {
  const sorted = [...events].sort((a, b) => time(a.readAt) - time(b.readAt));
  const first = sorted[0] ?? null;
  const latest = sorted[sorted.length - 1] ?? null;
  const furthest = events.reduce<ReadingEventLike | null>(
    (max, event) => (!max || event.pagesRead > max.pagesRead ? event : max),
    null,
  );

  return { first, latest, furthest, progressPages: furthest?.pagesRead ?? 0 };
}
