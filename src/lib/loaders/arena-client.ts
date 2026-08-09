import type { FetchArenaOptions } from "./arena-client.types";

const jsonCache = new Map<string, Promise<unknown>>();

const MAX_RETRY_DELAY_MS = 30_000;

/**
 * Fetch JSON from the Are.na API with build-scoped caching and retry/backoff.
 */
export function fetchArenaJson<T>(
  url: string | URL,
  { apiKey, maxRetries = 4 }: FetchArenaOptions,
): Promise<T> {
  const key = url.toString();

  const cached = jsonCache.get(key);
  if (cached) return cached as Promise<T>;

  const request = requestWithRetry(key, apiKey, maxRetries);
  jsonCache.set(key, request);
  // Don't cache failures: evict so a later caller starts fresh.
  request.catch(() => jsonCache.delete(key));

  return request as Promise<T>;
}

async function requestWithRetry(
  url: string,
  apiKey: string | undefined,
  maxRetries: number,
): Promise<unknown> {
  for (let attempt = 0; ; attempt++) {
    const response = await fetch(url, {
      headers: [["Authorization", `Bearer ${apiKey}`]],
    });

    if (response.ok) return response.json();

    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt >= maxRetries) {
      throw new Error(
        `Are.na request failed: ${response.status} ${response.statusText} (${url})`,
      );
    }

    await sleep(retryDelayMs(response, attempt));
  }
}

function retryDelayMs(response: Response, attempt: number): number {
  const retryAfter = response.headers.get("retry-after");
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (!Number.isNaN(seconds)) {
      return Math.min(seconds * 1000, MAX_RETRY_DELAY_MS);
    }
  }

  // Exponential backoff (0.5s, 1s, 2s, 4s ...) with jitter, capped.
  const base = Math.min(500 * 2 ** attempt, MAX_RETRY_DELAY_MS);
  return base + Math.random() * 250;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
