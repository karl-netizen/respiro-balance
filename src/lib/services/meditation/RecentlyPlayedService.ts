/**
 * Recently played sessions management service
 */

import { MeditationSession } from '@/types/meditation';

export class RecentlyPlayedService {
  private static readonly STORAGE_KEY = 'meditation-recently-played';
  private static readonly MAX_RECENT_ITEMS = 4;

  /**
   * Load recently played sessions from localStorage
   */
  static loadRecentlyPlayed(): MeditationSession[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading recently played:', error);
      return [];
    }
  }

  /**
   * Save recently played sessions to localStorage
   */
  static saveRecentlyPlayed(sessions: MeditationSession[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving recently played:', error);
    }
  }

  /**
   * Add session to recently played list
   */
  static addToRecentlyPlayed(
    session: MeditationSession, 
    currentRecent: MeditationSession[]
  ): MeditationSession[] {
    // Remove if already exists
    const filtered = currentRecent.filter(s => s.id !== session.id);
    
    // Add to beginning and limit to max items
    return [session, ...filtered].slice(0, this.MAX_RECENT_ITEMS);
  }
}