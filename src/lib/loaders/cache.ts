/**
 * Memoises a promise under `key` in `store`, so concurrent and later callers
 * share one request. Failures are evicted so a later caller starts fresh.
 */
export function cached<T>(
  store: Map<string, Promise<unknown>>,
  key: string,
  request: () => Promise<T>,
): Promise<T> {
  const hit = store.get(key);
  if (hit) {
    return hit as Promise<T>;
  }

  const pending = request();
  store.set(key, pending);
  pending.catch(() => store.delete(key));

  return pending;
}
