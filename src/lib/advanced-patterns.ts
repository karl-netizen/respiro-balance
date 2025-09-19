// ===================================================================
// ADVANCED PATTERNS FOR TYPE SAFETY AND ERROR HANDLING
// ===================================================================

// Brand type for creating nominal types
export type Brand<T, U> = T & { __brand: U };

// Result type for functional error handling
export type Result<T, E> = Ok<T> | Err<E>;

export class Ok<T> {
  readonly tag = 'Ok';
  constructor(public readonly value: T) {}
}

export class Err<E> {
  readonly tag = 'Err';
  constructor(public readonly value: E) {}
}