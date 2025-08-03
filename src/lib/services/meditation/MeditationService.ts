/**
 * Core meditation business logic service
 */

import { MeditationSession } from '@/types/meditation';

export class MeditationService {
  /**
   * Validates a meditation session has all required properties
   */
  static validateSession(session: MeditationSession): MeditationSession {
    return {
      ...session,
      image_url: session.image_url || '/images/meditations/default-meditation.jpg',
      icon: session.icon || '🧘',
      duration: session.duration || 10,
      title: session.title || 'Untitled Meditation',
      description: session.description || 'A moment of mindfulness',
      category: session.category || 'guided',
      level: session.level || 'beginner',
      instructor: session.instructor || 'Anonymous'
    };
  }

  /**
   * Calculates session progress percentage
   */
  static calculateProgress(current: number, total: number): number {
    if (total <= 0) return 0;
    return Math.min(100, (current / total) * 100);
  }

  /**
   * Filters sessions by search criteria
   */
  static filterSessions(
    sessions: MeditationSession[],
    searchTerm: string,
    category?: string,
    level?: string
  ): MeditationSession[] {
    return sessions.filter(session => {
      const matchesSearch = !searchTerm || 
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.instructor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !category || session.category === category;
      const matchesLevel = !level || session.level === level;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }

  /**
   * Sorts sessions by specified criteria
   */
  static sortSessions(sessions: MeditationSession[], sortBy: string): MeditationSession[] {
    const sorted = [...sessions];
    
    switch (sortBy) {
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'duration':
        return sorted.sort((a, b) => a.duration - b.duration);
      case 'level':
        return sorted.sort((a, b) => a.level.localeCompare(b.level));
      case 'instructor':
        return sorted.sort((a, b) => a.instructor.localeCompare(b.instructor));
      default:
        return sorted;
    }
  }
}