
import { MeditationSession } from '@/types/meditation';

/**
 * Ensures a meditation session has all required properties with valid values
 */
export const validateMeditationSession = (session: MeditationSession): MeditationSession => {
  return {
    ...session,
    // Use default values for critical properties if they're missing
    image_url: session.image_url || '/images/meditations/default-meditation.jpg',
    icon: session.icon || '🧘',
    duration: session.duration || 10,
    title: session.title || 'Untitled Meditation',
    description: session.description || 'A moment of mindfulness',
    category: session.category || 'guided',
    level: session.level || 'beginner',
    instructor: session.instructor || 'Anonymous'
  };
};

/**
 * Formats time in seconds to MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

/**
 * Calculates progress percentage
 */
export const calculateProgress = (current: number, total: number): number => {
  if (total <= 0) return 0;
  return Math.min(100, (current / total) * 100);
};
