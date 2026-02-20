type CacheEntry<T> = {
  data?: T;
  expiresAt: number;
  inFlight?: Promise<T>;
};

const cache = new Map<string, CacheEntry<unknown>>();

export async function getOrFetchCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs = 30_000
): Promise<T> {
  const now = Date.now();
  const existing = cache.get(key) as CacheEntry<T> | undefined;

  if (existing?.data !== undefined && existing.expiresAt > now) {
    return existing.data;
  }

  if (existing?.inFlight) {
    return existing.inFlight;
  }

  const inFlight = fetcher()
    .then((data) => {
      cache.set(key, { data, expiresAt: Date.now() + ttlMs });
      return data;
    })
    .catch((error) => {
      cache.delete(key);
      throw error;
    });

  cache.set(key, {
    data: existing?.data,
    expiresAt: existing?.expiresAt ?? 0,
    inFlight,
  });

  return inFlight;
}

export function setCached<T>(key: string, data: T, ttlMs = 30_000) {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

export function invalidateCache(key: string) {
  cache.delete(key);
}
