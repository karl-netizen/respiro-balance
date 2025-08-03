
// DEPRECATED: This hook has been decomposed into smaller, focused hooks
// Use useMeditationPageComposed instead for new implementations
// This file is kept for backward compatibility during migration

import { useMeditationPageComposed } from './meditation/useMeditationPageComposed';

/**
 * @deprecated Use useMeditationPageComposed instead
 * This hook will be removed in a future version
 */
export const useMeditatePage = () => {
  console.warn('⚠️ useMeditatePage is deprecated. Use useMeditationPageComposed instead.');
  return useMeditationPageComposed();
};
