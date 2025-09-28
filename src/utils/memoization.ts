type CacheKey = string | number | symbol;
type CacheValue = unknown;

interface MemoizeOptions {
  maxAge?: number;
  maxSize?: number;
  keyResolver?: (...args: unknown[]) => CacheKey;
}

class LRUCache<K, V> {
  private cache: Map<K, { value: V; timestamp: number }>;
  private maxSize: number;
  private maxAge: number;

  constructor(maxSize: number = 100, maxAge: number = Infinity) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.maxAge = maxAge;
  }

  get(key: K): V | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;

    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key);
      return undefined;
    }

    this.cache.delete(key);
    this.cache.set(key, item);
    return item.value;
  }

  set(key: K, value: V): void {
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: K): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }
}

export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options: MemoizeOptions = {}
): T {
  const {
    maxAge = Infinity,
    maxSize = 100,
    keyResolver = (...args) => JSON.stringify(args)
  } = options;

  const cache = new LRUCache<CacheKey, ReturnType<T>>(maxSize, maxAge);

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyResolver(...args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

export function memoizeAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: MemoizeOptions = {}
): T {
  const {
    maxAge = 60000,
    maxSize = 50,
    keyResolver = (...args) => JSON.stringify(args)
  } = options;

  const cache = new LRUCache<CacheKey, Promise<Awaited<ReturnType<T>>>>(maxSize, maxAge);
  const pendingCache = new Map<CacheKey, Promise<Awaited<ReturnType<T>>>>();

  return (async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    const key = keyResolver(...args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    if (pendingCache.has(key)) {
      return pendingCache.get(key)!;
    }

    const promise = fn(...args);
    pendingCache.set(key, promise);

    try {
      const result = await promise;
      cache.set(key, Promise.resolve(result));
      return result;
    } finally {
      pendingCache.delete(key);
    }
  }) as T;
}

export function createMemoizedSelector<T, R>(
  selector: (state: T) => R,
  equalityFn?: (prev: R, next: R) => boolean
): (state: T) => R {
  let lastState: T | undefined;
  let lastResult: R | undefined;
  let isFirstCall = true;

  return (state: T): R => {
    if (isFirstCall) {
      lastState = state;
      lastResult = selector(state);
      isFirstCall = false;
      return lastResult;
    }

    if (state === lastState) {
      return lastResult!;
    }

    const newResult = selector(state);

    if (equalityFn ? equalityFn(lastResult!, newResult) : lastResult === newResult) {
      return lastResult!;
    }

    lastState = state;
    lastResult = newResult;
    return newResult;
  };
}