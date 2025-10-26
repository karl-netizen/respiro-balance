// =============================================
// GENERIC CONSTRAINTS & UTILITY TYPES
// =============================================

export type MeditationCategory = 'mindfulness' | 'sleep' | 'stress' | 'focus' | 'breathing';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

import { SubscriptionTier } from './meditation.types';
import { MeditationId } from './branded.types';
import { AsyncOperationState } from './state.types';

// Generic constraint for items with required properties
export interface Identifiable {
  id: string;
}

export interface Timestamped {
  created_at: string;
  updated_at: string;
}

export interface Favoritable {
  is_favorite?: boolean;
}

// Generic card component constraint
export interface CardItemBase extends Identifiable {
  title: string;
  description?: string;
}

// Generic props with constraints
export interface GenericCardProps<T extends CardItemBase> {
  item: T;
  onSelect: (item: T) => void;
  onAction?: (action: string, item: T) => void;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

// Generic list component with advanced constraints
export interface GenericListProps<T extends Identifiable & Timestamped> {
  items: T[];
  selectedItems?: Set<T['id']>;
  onItemSelect: (item: T) => void;
  onItemAction: (action: string, item: T) => Promise<void>;
  renderItem?: (item: T, index: number) => React.ReactNode;
  filterFn?: (item: T, query: string) => boolean;
  sortFn?: (a: T, b: T) => number;
  groupBy?: keyof T;
  virtualized?: boolean;
  pageSize?: number;
}

// Utility types for data transformations
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Utility type for API responses
export type ApiResponse<T> = {
  data: T;
  meta: {
    page?: number;
    limit?: number;
    total?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
  timestamp: Date;
};

// Utility type for form data
export type FormData<T> = {
  [K in keyof T]: T[K] extends string 
    ? string 
    : T[K] extends number 
    ? number 
    : T[K] extends boolean 
    ? boolean 
    : T[K] extends Date 
    ? string 
    : never;
};

// Advanced utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Mapped type for form validation
export type ValidationErrors<T> = {
  [K in keyof T]?: T[K] extends string 
    ? 'required' | 'invalid' | 'too_short' | 'too_long'
    : T[K] extends number 
    ? 'required' | 'invalid' | 'too_small' | 'too_large'
    : T[K] extends boolean 
    ? 'required'
    : never;
};

// Conditional types for content features based on subscription
export type ContentFeatures<T extends SubscriptionTier> = 
  T extends SubscriptionTier.FREE 
    ? { ads: true; qualityLimit: '128kbps'; downloadable: false }
    : T extends SubscriptionTier.PREMIUM 
    ? { ads: false; qualityLimit: '320kbps'; downloadable: true; offlineSync: true }
    : { ads: false; qualityLimit: 'lossless'; downloadable: true; offlineSync: true; analytics: true };

// Event handler types with proper constraints
export type EventHandler<T extends Event, R = void> = (event: T) => R;
export type AsyncEventHandler<T extends Event, R = void> = (event: T) => Promise<R>;

// Specific event handler types
export type AudioEventHandler = EventHandler<Event & { target: HTMLAudioElement }>;
export type FileEventHandler = EventHandler<Event & { target: HTMLInputElement }>;

// Advanced event handler with error boundaries
export type SafeEventHandler<T extends Event, R = void> = (
  event: T
) => R | Promise<R> | AsyncOperationState<R>;

// Generic async hook return type
export interface UseAsyncReturn<T> {
  state: AsyncOperationState<T>;
  execute: (...args: unknown[]) => Promise<void>;
  reset: () => void;
  cancel: () => void;
}