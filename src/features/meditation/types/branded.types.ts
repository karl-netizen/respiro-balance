// =============================================
// BRANDED TYPES FOR ID SAFETY
// =============================================

// Base branded type utility
type Brand<T, TBrand extends string> = T & { __brand: TBrand };

// Branded ID types to prevent mix-ups
export type MeditationId = Brand<string, 'MeditationId'>;
export type UserId = Brand<string, 'UserId'>;
export type AudioFileId = Brand<string, 'AudioFileId'>;
export type CategoryId = Brand<string, 'CategoryId'>;
export type SessionId = Brand<string, 'SessionId'>;

// Branded type creators (factories)
export const createMeditationId = (id: string): MeditationId => id as MeditationId;
export const createUserId = (id: string): UserId => id as UserId;
export const createAudioFileId = (id: string): AudioFileId => id as AudioFileId;
export const createCategoryId = (id: string): CategoryId => id as CategoryId;
export const createSessionId = (id: string): SessionId => id as SessionId;

// Type guards for branded types
export const isMeditationId = (id: string): id is MeditationId => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};

export const isUserId = (id: string): id is UserId => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};

export const isAudioFileId = (id: string): id is AudioFileId => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};

// Type assertion helpers
export const assertMeditationId = (value: string): asserts value is MeditationId => {
  if (!isMeditationId(value)) {
    throw new Error(`Invalid meditation ID: ${value}`);
  }
};

export const assertUserId = (value: string): asserts value is UserId => {
  if (!isUserId(value)) {
    throw new Error(`Invalid user ID: ${value}`);
  }
};

export const assertAudioFileId = (value: string): asserts value is AudioFileId => {
  if (!isAudioFileId(value)) {
    throw new Error(`Invalid audio file ID: ${value}`);
  }
};