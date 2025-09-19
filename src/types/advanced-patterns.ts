// ===================================================================
// ADVANCED TYPE PATTERNS FOR TYPE-SAFE DEVELOPMENT
// ===================================================================

// 1. BRANDED TYPES FOR TYPE SAFETY
// ===================================================================

/**
 * Branded type utility - creates nominal typing for primitive types
 * Prevents mixing up different types that have the same underlying structure
 */
export type Brand<T, B> = T & { readonly __brand: B };

// Core branded types
export type UserId = Brand<string, 'UserId'>;
export type Email = Brand<string, 'Email'>;

// Factory functions for branded types
export const createUserId = (id: string): UserId => id as UserId;
export const createEmail = (email: string): Email => email as Email;

// 2. RESULT TYPE FOR ERROR HANDLING
// ===================================================================

/**
 * Result type for functional error handling
 * Eliminates need for try-catch blocks and makes error handling explicit
 */
export type Result<T, E> = Success<T> | Failure<E>;

export interface Success<T> {
  readonly success: true;
  readonly data: T;
}

export interface Failure<E> {
  readonly success: false;
  readonly error: E;
}

// Result constructor functions
export const Ok = <T>(data: T): Success<T> => ({ success: true, data });
export const Err = <E>(error: E): Failure<E> => ({ success: false, error });

// Result utility functions
export const isOk = <T, E>(result: Result<T, E>): result is Success<T> => result.success;
export const isErr = <T, E>(result: Result<T, E>): result is Failure<E> => !result.success;

export const mapResult = <T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => U
): Result<U, E> => {
  if (result.success) {
    return Ok(fn(result.data));
  }
  return result as Failure<E>;
};

export const mapError = <T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F
): Result<T, F> => {
  if (result.success) {
    return result as Success<T>;
  }
  return Err(fn(result.error));
};

export const chainResult = <T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => Result<U, E>
): Result<U, E> => {
  if (result.success) {
    return fn(result.data);
  }
  return result as Failure<E>;
};

// 3. STATE MACHINE PATTERNS
// ===================================================================

/**
 * Generic state machine type for modeling complex state transitions
 * Ensures all possible states are handled explicitly
 */
export type StateMachine<S extends string, D = {}> = {
  [K in S]: { type: K } & D
}[S];

/**
 * Authentication state machine
 * Models all possible authentication states with their associated data
 */
export type AuthState = StateMachine<
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'error'
  | 'expired'
  | 'locked',
  {
    idle: {};
    loading: { operation: string };
    authenticated: { 
      user: any; 
      expiresAt: Date;
      permissions: readonly string[];
    };
    error: { 
      message: string; 
      code: string;
      retryable: boolean;
    };
    expired: { 
      canRefresh: boolean;
      lastActive: Date;
    };
    locked: { 
      reason: string;
      unlockAt: Date;
    };
  }
>;

// 4. VALIDATION PATTERNS
// ===================================================================

/**
 * Validation result type
 * Separates successful validation from validation errors
 */
export type ValidationResult<T> = Result<T, ValidationError[]>;

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * Validator function type
 * Pure function that takes input and returns validation result
 */
export type Validator<T, U = T> = (input: T) => ValidationResult<U>;

// Validator combinators
export const compose = <T, U, V>(
  validator1: Validator<T, U>,
  validator2: Validator<U, V>
): Validator<T, V> => {
  return (input: T) => {
    const result1 = validator1(input);
    if (!result1.success) {
      return result1 as Failure<ValidationError[]>;
    }
    return validator2(result1.data);
  };
};

export const all = <T>(...validators: Validator<T>[]): Validator<T> => {
  return (input: T) => {
    const errors: ValidationError[] = [];
    
    for (const validator of validators) {
      const result = validator(input);
      if (!result.success) {
        errors.push(...result.error);
      }
    }
    
    return errors.length > 0 ? Err(errors) : Ok(input);
  };
};

// 5. OPTION TYPE FOR NULL SAFETY
// ===================================================================

/**
 * Option type for handling nullable values safely
 * Eliminates null/undefined runtime errors
 */
export type Option<T> = Some<T> | None;

export interface Some<T> {
  readonly kind: 'some';
  readonly value: T;
}

export interface None {
  readonly kind: 'none';
}

// Option constructor functions
export const Some = <T>(value: T): Some<T> => ({ kind: 'some', value });
export const None: None = { kind: 'none' };

// Option utility functions
export const isSome = <T>(option: Option<T>): option is Some<T> => option.kind === 'some';
export const isNone = <T>(option: Option<T>): option is None => option.kind === 'none';

export const mapOption = <T, U>(
  option: Option<T>,
  fn: (value: T) => U
): Option<U> => {
  return isSome(option) ? Some(fn(option.value)) : None;
};

export const flatMapOption = <T, U>(
  option: Option<T>,
  fn: (value: T) => Option<U>
): Option<U> => {
  return isSome(option) ? fn(option.value) : None;
};

export const getOrElse = <T>(option: Option<T>, defaultValue: T): T => {
  return isSome(option) ? option.value : defaultValue;
};

// 6. ASYNC PATTERNS
// ===================================================================

/**
 * Async Result type for handling async operations
 * Combines Promise with Result for safe async error handling
 */
export type AsyncResult<T, E> = Promise<Result<T, E>>;

// Async Result utilities
export const asyncOk = <T>(data: T): AsyncResult<T, never> => Promise.resolve(Ok(data));
export const asyncErr = <E>(error: E): AsyncResult<never, E> => Promise.resolve(Err(error));

export const asyncMapResult = async <T, U, E>(
  asyncResult: AsyncResult<T, E>,
  fn: (data: T) => U | Promise<U>
): Promise<Result<U, E>> => {
  const result = await asyncResult;
  if (result.success) {
    const mapped = await fn(result.data);
    return Ok(mapped);
  }
  return result as Failure<E>;
};

export const asyncChainResult = async <T, U, E>(
  asyncResult: AsyncResult<T, E>,
  fn: (data: T) => AsyncResult<U, E>
): Promise<Result<U, E>> => {
  const result = await asyncResult;
  if (result.success) {
    return fn(result.data);
  }
  return result as Failure<E>;
};

// 7. EVENT PATTERNS
// ===================================================================

/**
 * Domain event type for event-driven architecture
 * Ensures all events have consistent structure
 */
export interface DomainEvent<T = any> {
  readonly id: string;
  readonly type: string;
  readonly timestamp: Date;
  readonly aggregateId: string;
  readonly version: number;
  readonly data: T;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Event handler type
 * Pure function that processes domain events
 */
export type EventHandler<T> = (event: DomainEvent<T>) => Promise<void> | void;

/**
 * Event store interface for persisting and retrieving events
 */
export interface EventStore {
  append<T>(events: DomainEvent<T>[]): Promise<Result<void, string>>;
  getEvents(aggregateId: string): Promise<Result<DomainEvent[], string>>;
  getEventsByType(eventType: string): Promise<Result<DomainEvent[], string>>;
}

// 8. REPOSITORY PATTERNS
// ===================================================================

/**
 * Generic repository interface
 * Provides consistent data access patterns
 */
export interface Repository<T, ID = string> {
  findById(id: ID): AsyncResult<Option<T>, string>;
  findAll(): AsyncResult<T[], string>;
  save(entity: T): AsyncResult<T, string>;
  delete(id: ID): AsyncResult<void, string>;
}

/**
 * Specification pattern for complex queries
 * Allows composable query logic
 */
export interface Specification<T> {
  isSatisfiedBy(entity: T): boolean;
  and(other: Specification<T>): Specification<T>;
  or(other: Specification<T>): Specification<T>;
  not(): Specification<T>;
}

// 9. VALUE OBJECT PATTERNS
// ===================================================================

/**
 * Base class for value objects
 * Ensures immutability and equality by value
 */
export abstract class ValueObject {
  protected abstract getEqualityComponents(): unknown[];

  equals(other: ValueObject): boolean {
    if (this.constructor !== other.constructor) {
      return false;
    }
    
    const thisComponents = this.getEqualityComponents();
    const otherComponents = other.getEqualityComponents();
    
    if (thisComponents.length !== otherComponents.length) {
      return false;
    }
    
    return thisComponents.every((component, index) => 
      component === otherComponents[index]
    );
  }

  toString(): string {
    return `${this.constructor.name}(${this.getEqualityComponents().join(', ')})`;
  }
}

// 10. AGGREGATE ROOT PATTERNS
// ===================================================================

/**
 * Base class for aggregate roots in DDD
 * Manages domain events and business rules
 */
export abstract class AggregateRoot<ID = string> {
  private _domainEvents: DomainEvent[] = [];
  
  constructor(public readonly id: ID) {}

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  getDomainEvents(): readonly DomainEvent[] {
    return [...this._domainEvents];
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }
}

export default {
  // Branded types
  createUserId,
  createEmail,
  
  // Result types
  Ok,
  Err,
  isOk,
  isErr,
  mapResult,
  mapError,
  chainResult,
  
  // Option types
  Some,
  None,
  isSome,
  isNone,
  mapOption,
  flatMapOption,
  getOrElse,
  
  // Async utilities
  asyncOk,
  asyncErr,
  asyncMapResult,
  asyncChainResult,
  
  // Validation
  compose,
  all,
  
  // Base classes
  ValueObject,
  AggregateRoot,
};