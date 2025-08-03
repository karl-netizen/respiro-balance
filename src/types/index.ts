/**
 * Type definitions organized by domain
 */

// Core application types
export * from './core';

// Domain-specific types
export type { MeditationSession } from './meditation';

// UI and component types
export * from './ui';
export * from './componentInterfaces';

// External integration types
export * from './supabase';
export * from './achievements';