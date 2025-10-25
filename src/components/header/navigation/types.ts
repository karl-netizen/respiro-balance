// ===================================================================
// ADVANCED TYPESCRIPT PATTERNS FOR NAVIGATION SYSTEM
// ===================================================================

// 1. BRANDED TYPES - Domain-specific navigation identifiers
// ===================================================================

type Brand<T, K> = T & { __brand: K };

export type NavItemId = Brand<string, 'NavItemId'>;
export type RoutePath = Brand<string, 'RoutePath'>;
export type CategoryId = Brand<string, 'CategoryId'>;
export type DropdownId = Brand<string, 'DropdownId'>;

// Smart constructors with validation
export const createNavItemId = (id: string): NavItemId => {
  if (!id || id.length < 2) {
    throw new Error('Invalid navigation item ID');
  }
  return id as NavItemId;
};

export const createRoutePath = (path: string): RoutePath => {
  if (!path.startsWith('/')) {
    throw new Error('Route path must start with /');
  }
  return path as RoutePath;
};

export const createCategoryId = (id: string): CategoryId => {
  if (!id || !/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(id)) {
    throw new Error('Invalid category ID format');
  }
  return id as CategoryId;
};

// 2. TEMPLATE LITERAL TYPES - Type-safe route patterns
// ===================================================================

export type AppRoute = 
  | '/'
  | '/meditate'
  | `/meditate?tab=${string}`
  | '/library'
  | '/profile'
  | '/settings'
  | `/api/${string}`;

export type MeditationRoute = `/meditate?tab=${string}`;
export type ApiRoute = `/api/${string}`;

// Route parameter extraction
export type ExtractRouteParams<T extends string> = 
  T extends `${string}?${infer Params}` 
    ? ParseQueryParams<Params>
    : {};

type ParseQueryParams<T extends string> = 
  T extends `${infer Key}=${ string}&${infer Rest}`
    ? { [K in Key]: string } & ParseQueryParams<Rest>
    : T extends `${infer Key}=${ string}`
    ? { [K in Key]: string }
    : {};

// 3. DISCRIMINATED UNIONS - Navigation state management
// ===================================================================

export type NavigationState = 
  | { status: 'idle' }
  | { status: 'navigating'; targetPath: RoutePath }
  | { status: 'success'; currentPath: RoutePath; timestamp: Date }
  | { status: 'error'; error: NavigationError; previousPath?: RoutePath };

export type DropdownState = 
  | { type: 'closed' }
  | { type: 'opening'; dropdownId: DropdownId }
  | { type: 'open'; dropdownId: DropdownId; activeItemId?: NavItemId }
  | { type: 'closing'; dropdownId: DropdownId };

// 4. ADVANCED UTILITY TYPES
// ===================================================================

// Deep readonly for immutable navigation config
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Require at least one navigation item
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>>
  & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// Extract component props
export type ComponentProps<T extends React.ComponentType<any>> = 
  T extends React.ComponentType<infer P> ? P : never;

// 5. CONDITIONAL TYPES - Dynamic navigation behavior
// ===================================================================

export type NavigationConfig<T extends 'dropdown' | 'link'> = {
  id: NavItemId;
  label: string;
  path: RoutePath;
  icon?: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
} & (T extends 'dropdown' 
  ? { 
      type: 'dropdown'; 
      items: NavigationItem[];
      defaultOpen?: boolean;
    }
  : { type: 'link' }
);

// 6. ERROR HANDLING TYPES
// ===================================================================

export class NavigationError extends Error {
  constructor(
    message: string,
    public code: NavigationErrorCode,
    public context?: NavigationErrorContext
  ) {
    super(message);
    this.name = 'NavigationError';
  }
}

export type NavigationErrorCode = 
  | 'INVALID_ROUTE'
  | 'UNAUTHORIZED_ACCESS'
  | 'NAVIGATION_FAILED'
  | 'DROPDOWN_ERROR';

export interface NavigationErrorContext {
  path?: RoutePath;
  dropdownId?: DropdownId;
  userId?: string;
  timestamp: Date;
}

export type Result<T, E = NavigationError> = 
  | { success: true; data: T }
  | { success: false; error: E };

// 7. CORE INTERFACES WITH ENHANCED TYPING
// ===================================================================

export interface NavigationItem {
  readonly id: NavItemId;
  readonly label: string;
  readonly path: RoutePath;
  readonly category?: CategoryId;
  readonly icon?: React.ComponentType<{ className?: string }>;
  readonly requiresAuth?: boolean;
  readonly isExternal?: boolean;
  readonly metadata?: DeepReadonly<Record<string, unknown>>;
}

export interface DropdownConfig {
  readonly id: DropdownId;
  readonly title: string;
  readonly items: readonly NavigationItem[];
  readonly defaultCategory?: CategoryId;
  readonly maxItems?: number;
  readonly groupBy?: keyof NavigationItem;
}

// 8. EVENT SYSTEM TYPES
// ===================================================================

type NavigationEventMap = {
  'nav:itemClick': { itemId: NavItemId; path: RoutePath; timestamp: Date };
  'nav:dropdownOpen': { dropdownId: DropdownId };
  'nav:dropdownClose': { dropdownId: DropdownId };
  'nav:navigationStart': { fromPath: RoutePath; toPath: RoutePath };
  'nav:navigationComplete': { path: RoutePath; duration: number };
  'nav:navigationError': { error: NavigationError; attemptedPath: RoutePath };
};

export class NavigationEventEmitter {
  private listeners: Map<string, Function[]> = new Map();

  on<K extends keyof NavigationEventMap>(
    event: K,
    listener: (payload: NavigationEventMap[K]) => void
  ): void {
    const handlers = this.listeners.get(event) || [];
    handlers.push(listener);
    this.listeners.set(event, handlers);
  }

  emit<K extends keyof NavigationEventMap>(
    event: K,
    payload: NavigationEventMap[K]
  ): void {
    const handlers = this.listeners.get(event) || [];
    handlers.forEach(handler => handler(payload));
  }

  off<K extends keyof NavigationEventMap>(
    event: K,
    listener: (payload: NavigationEventMap[K]) => void
  ): void {
    const handlers = this.listeners.get(event) || [];
    const index = handlers.indexOf(listener);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }
}

// 9. TYPE GUARDS
// ===================================================================

export const isValidRoutePath = (path: string): path is RoutePath => {
  return typeof path === 'string' && path.startsWith('/');
};

export const isNavigationSuccess = <T>(result: Result<T>): result is { success: true; data: T } => {
  return result.success;
};

export const isNavigationError = <T>(result: Result<T, NavigationError>): result is { success: false; error: NavigationError } => {
  return !result.success;
};

export const isDropdownOpen = (state: DropdownState): state is { type: 'open'; dropdownId: DropdownId; activeItemId?: NavItemId } => {
  return state.type === 'open';
};

// 10. UTILITY FUNCTIONS
// ===================================================================

export const Ok = <T>(data: T): Result<T, never> => ({ success: true, data });
export const Err = <E>(error: E): Result<never, E> => ({ success: false, error });

export const safeNavigate = (path: string): Result<RoutePath, NavigationError> => {
  try {
    if (!isValidRoutePath(path)) {
      return Err(new NavigationError(
        `Invalid route path: ${path}`,
        'INVALID_ROUTE',
        { path: path as RoutePath, timestamp: new Date() }
      ));
    }
    return Ok(createRoutePath(path));
  } catch (error) {
    return Err(new NavigationError(
      error instanceof Error ? error.message : 'Unknown navigation error',
      'NAVIGATION_FAILED',
      { timestamp: new Date() }
    ));
  }
};

// 11. TESTING UTILITIES
// ===================================================================

export const createMockNavigationItem = (overrides?: Partial<NavigationItem>): NavigationItem => ({
  id: createNavItemId('test_nav_item'),
  label: 'Test Item',
  path: createRoutePath('/test'),
  ...overrides
});

export const createMockDropdownConfig = (overrides?: Partial<DropdownConfig>): DropdownConfig => ({
  id: 'test_dropdown' as DropdownId,
  title: 'Test Dropdown',
  items: [createMockNavigationItem()],
  ...overrides
});

export const assertNavigationSuccess = <T>(
  result: Result<T>
): asserts result is { success: true; data: T } => {
  if (!result.success) {
    throw new Error(`Expected navigation success but got error: ${(result as { success: false; error: NavigationError }).error.message}`);
  }
};