/**
 * Favorites management service
 */

import { MeditationSession } from '@/types/meditation';

export class FavoritesService {
  private static readonly STORAGE_KEY = 'meditation-favorites';

  /**
   * Load favorites from localStorage
   */
  static loadFavorites(): string[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }

  /**
   * Save favorites to localStorage
   */
  static saveFavorites(favorites: string[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  /**
   * Toggle favorite status for a session
   */
  static toggleFavorite(sessionId: string, currentFavorites: string[]): string[] {
    if (currentFavorites.includes(sessionId)) {
      return currentFavorites.filter(id => id !== sessionId);
    } else {
      return [...currentFavorites, sessionId];
    }
  }

  /**
   * Check if session is favorite
   */
  static isFavorite(sessionId: string, favorites: string[]): boolean {
    return favorites.includes(sessionId);
  }

  /**
   * Filter sessions to show only favorites
   */
  static filterFavorites(sessions: MeditationSession[], favorites: string[]): MeditationSession[] {
    return sessions.filter(session => favorites.includes(session.id));
  }
}