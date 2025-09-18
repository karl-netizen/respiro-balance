// =============================================
// DISCRIMINATED UNIONS FOR STATE MANAGEMENT
// =============================================

import { MeditationContent, MeditationCategory, DifficultyLevel, AudioFile } from './meditation.types';

// Resource state with discriminated union
export type ResourceState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T; lastUpdated: Date }
  | { status: 'error'; error: string; retryCount: number };

// Async operation state
export type AsyncOperationState<T = unknown> =
  | { type: 'idle' }
  | { type: 'pending'; progress?: number }
  | { type: 'fulfilled'; value: T; timestamp: Date }
  | { type: 'rejected'; error: Error; canRetry: boolean };

// Audio player state with discriminated union
export type AudioPlayerState = 
  | { status: 'idle' }
  | { status: 'loading'; progress: number }
  | { status: 'playing'; currentTime: number; duration: number; content: MeditationContent }
  | { status: 'paused'; currentTime: number; duration: number; content: MeditationContent }
  | { status: 'ended'; content: MeditationContent }
  | { status: 'error'; error: string };

// Component state union
export type MeditationLibraryState = {
  content: ResourceState<MeditationContent[]>;
  audioFiles: ResourceState<AudioFile[]>;
  selectedContent: MeditationContent | null;
  audioPlayer: AudioPlayerState;
  filters: {
    category: MeditationCategory;
    searchQuery: string;
    difficulty: DifficultyLevel[];
    duration: [number, number];
  };
};

// Type assertion for resource state
export const assertResourceState = <T>(
  state: unknown
): asserts state is ResourceState<T> => {
  if (
    typeof state !== 'object' || 
    state === null || 
    !('status' in state) ||
    typeof (state as { status: unknown }).status !== 'string'
  ) {
    throw new Error('Invalid resource state');
  }
};

// Helper functions for state management
export const createIdleState = <T>(): ResourceState<T> => ({ status: 'idle' });
export const createLoadingState = <T>(): ResourceState<T> => ({ status: 'loading' });
export const createSuccessState = <T>(data: T): ResourceState<T> => ({ 
  status: 'success', 
  data, 
  lastUpdated: new Date() 
});
export const createErrorState = <T>(error: string, retryCount = 0): ResourceState<T> => ({ 
  status: 'error', 
  error, 
  retryCount 
});

// Helper functions for async operations
export const createIdleOperation = (): AsyncOperationState => ({ type: 'idle' });
export const createPendingOperation = (progress?: number): AsyncOperationState => ({ 
  type: 'pending', 
  progress 
});
export const createFulfilledOperation = <T>(value: T): AsyncOperationState<T> => ({ 
  type: 'fulfilled', 
  value, 
  timestamp: new Date() 
});
export const createRejectedOperation = (error: Error, canRetry = true): AsyncOperationState => ({ 
  type: 'rejected', 
  error, 
  canRetry 
});