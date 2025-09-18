// Comprehensive error type definitions

export class MeditationLibraryError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'MeditationLibraryError';
  }
}

export class AudioProcessingError extends MeditationLibraryError {
  constructor(message: string, public audioFile: File | string) {
    super(message, 'AUDIO_PROCESSING_ERROR', { audioFile });
    this.name = 'AudioProcessingError';
  }
}

export class StorageError extends MeditationLibraryError {
  constructor(message: string, public operation: string) {
    super(message, 'STORAGE_ERROR', { operation });
    this.name = 'StorageError';
  }
}

export class PlaybackError extends MeditationLibraryError {
  constructor(message: string, public contentId: string) {
    super(message, 'PLAYBACK_ERROR', { contentId });
    this.name = 'PlaybackError';
  }
}

export class ValidationError extends MeditationLibraryError {
  constructor(message: string, public field: string, public value: unknown) {
    super(message, 'VALIDATION_ERROR', { field, value });
    this.name = 'ValidationError';
  }
}

export class NetworkError extends MeditationLibraryError {
  constructor(message: string, public endpoint: string, public status?: number) {
    super(message, 'NETWORK_ERROR', { endpoint, status });
    this.name = 'NetworkError';
  }
}

// Error handler utility type
export type ErrorHandler = (error: unknown) => void;

// Error context for logging
export interface ErrorContext {
  component: string;
  action: string;
  userId?: string;
  contentId?: string;
  timestamp: Date;
  userAgent: string;
  url: string;
}