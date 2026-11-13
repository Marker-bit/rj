/**
 * The shared MutationCache shows a neutral "action failed" toast. Mutations
 * that render a more specific toast set `meta: { errorHandled: true }` so the
 * user never sees two contradictory messages.
 */
export function shouldReportMutationError(
  meta: Record<string, unknown> | undefined,
): boolean {
  return meta?.errorHandled !== true;
}
