// ===================================================================
// ADVANCED TYPESCRIPT PATTERNS FOR RESPIRO BALANCE
// ===================================================================

// Branded types for type safety
export type Brand<T, K> = T & { __brand: K };

// Result type for functional error handling
export type Result<T, E = Error> = 
  | { tag: 'Ok'; value: T }
  | { tag: 'Err'; value: E };

// Result constructors
export class Ok<T> {
  public readonly tag = 'Ok' as const;
  
  constructor(public readonly value: T) {}
}

export class Err<E> {
  public readonly tag = 'Err' as const;
  
  constructor(public readonly value: E) {}
}

// Result utility functions
export const isOk = <T, E>(result: Result<T, E>): result is { tag: 'Ok'; value: T } => {
  return result.tag === 'Ok';
};

export const isErr = <T, E>(result: Result<T, E>): result is { tag: 'Err'; value: E } => {
  return result.tag === 'Err';
};

// Optional type for nullable values
export type Optional<T> = T | null | undefined;

// Safe operations
export const safe = <T extends unknown[], R>(
  fn: (...args: T) => R
) => (...args: T): Result<R, Error> => {
  try {
    const result = fn(...args);
    return new Ok(result);
  } catch (error) {
    return new Err(error instanceof Error ? error : new Error(String(error)));
  }
};

// Async safe operations
export const safeAsync = <T extends unknown[], R>(
  fn: (...args: T) => Promise<R>
) => async (...args: T): Promise<Result<R, Error>> => {
  try {
    const result = await fn(...args);
    return new Ok(result);
  } catch (error) {
    return new Err(error instanceof Error ? error : new Error(String(error)));
  }
};