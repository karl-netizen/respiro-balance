// Runtime type validation utilities

import { 
  MeditationContent, 
  AudioFile, 
  MeditationProgress,
  MeditationCategory,
  DifficultyLevel,
  SubscriptionTier
} from '../types/meditation.types';

// Type guard for MeditationContent
export const isMeditationContent = (obj: unknown): obj is MeditationContent => {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const content = obj as Record<string, unknown>;
  
  return (
    typeof content.id === 'string' &&
    typeof content.title === 'string' &&
    typeof content.duration === 'number' &&
    typeof content.category === 'string' &&
    typeof content.description === 'string' &&
    typeof content.difficulty_level === 'string' &&
    typeof content.subscription_tier === 'string' &&
    typeof content.instructor === 'string' &&
    typeof content.is_featured === 'boolean' &&
    typeof content.is_active === 'boolean' &&
    typeof content.play_count === 'number' &&
    typeof content.average_rating === 'number' &&
    Array.isArray(content.tags) &&
    content.tags.every(tag => typeof tag === 'string')
  );
};

// Type guard for AudioFile
export const isAudioFile = (obj: unknown): obj is AudioFile => {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const file = obj as Record<string, unknown>;
  
  return (
    typeof file.id === 'string' &&
    typeof file.name === 'string' &&
    typeof file.url === 'string' &&
    typeof file.size === 'number' &&
    typeof file.type === 'string' &&
    file.uploadDate instanceof Date &&
    typeof file.isProcessing === 'boolean'
  );
};

// Type guard for MeditationProgress
export const isMeditationProgress = (obj: unknown): obj is MeditationProgress => {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const progress = obj as Record<string, unknown>;
  
  return (
    typeof progress.id === 'string' &&
    typeof progress.user_id === 'string' &&
    typeof progress.content_id === 'string' &&
    typeof progress.progress_seconds === 'number' &&
    typeof progress.completed === 'boolean' &&
    typeof progress.is_favorite === 'boolean' &&
    typeof progress.play_count === 'number' &&
    progress.last_played_at instanceof Date
  );
};

// Enum validation utilities
export const isValidMeditationCategory = (value: string): value is MeditationCategory => {
  return Object.values(MeditationCategory).includes(value as MeditationCategory);
};

export const isValidDifficultyLevel = (value: string): value is DifficultyLevel => {
  return Object.values(DifficultyLevel).includes(value as DifficultyLevel);
};

export const isValidSubscriptionTier = (value: string): value is SubscriptionTier => {
  return Object.values(SubscriptionTier).includes(value as SubscriptionTier);
};

// Array validation utilities
export const validateMeditationContentArray = (data: unknown[]): MeditationContent[] => {
  return data.filter(isMeditationContent);
};

export const validateAudioFileArray = (data: unknown[]): AudioFile[] => {
  return data.filter(isAudioFile);
};

export const validateMeditationProgressArray = (data: unknown[]): MeditationProgress[] => {
  return data.filter(isMeditationProgress);
};

// File validation utilities
export const isValidAudioFileType = (file: File): boolean => {
  const validTypes = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/m4a',
    'audio/aac',
    'audio/ogg',
    'audio/flac'
  ];
  
  return validTypes.includes(file.type);
};

export const isValidFileSize = (file: File, maxSizeMB: number = 50): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// String validation utilities
export const isValidId = (id: unknown): id is string => {
  return typeof id === 'string' && id.length > 0 && /^[a-zA-Z0-9-_]+$/.test(id);
};

export const isValidUrl = (url: unknown): url is string => {
  if (typeof url !== 'string') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Generic validation utility
export const createValidator = <T>(
  typeGuard: (obj: unknown) => obj is T
) => {
  return (data: unknown): T => {
    if (!typeGuard(data)) {
      throw new Error(`Invalid data structure: ${JSON.stringify(data)}`);
    }
    return data;
  };
};

// Validation result type for better error handling
export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  errors: string[];
}

export const validateWithResult = <T>(
  data: unknown,
  typeGuard: (obj: unknown) => obj is T,
  fieldName: string = 'data'
): ValidationResult<T> => {
  if (typeGuard(data)) {
    return {
      isValid: true,
      data,
      errors: []
    };
  }
  
  return {
    isValid: false,
    errors: [`Invalid ${fieldName} structure`]
  };
};