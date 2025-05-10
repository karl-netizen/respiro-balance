/**
 * TimeAwarenessService
 * Provides time-based functionality to adapt the application to the user's local time,
 * including time period detection, personalized greetings, and recommendations.
 */

export type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night';
export type MoodRecord = { mood: string; timestamp: string; timePeriod: TimePeriod };

interface TimeBasedRecommendations {
  meditation: {
    title: string;
    duration: number;
  };
  breathing: {
    title: string;
    duration: number;
  };
  activity: {
    title: string;
    duration: number;
  };
}

// Local storage keys
const MOOD_RECORDS_KEY = 'respiro_mood_records';

export class TimeAwarenessService {
  /**
   * Get the current time period based on local time
   * - Morning: 5:00 AM - 11:59 AM
   * - Afternoon: 12:00 PM - 5:59 PM
   * - Evening: 6:00 PM - 9:59 PM
   * - Night: 10:00 PM - 4:59 AM
   */
  static getCurrentTimePeriod(): TimePeriod {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return 'morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'afternoon';
    } else if (currentHour >= 18 && currentHour < 22) {
      return 'evening';
    } else {
      return 'night';
    }
  }

  /**
   * Get a greeting based on the current time of day
   */
  static getTimeBasedGreeting(userName: string = ""): string {
    const timePeriod = this.getCurrentTimePeriod();
    const nameGreeting = userName ? `, ${userName}` : '';
    
    switch (timePeriod) {
      case 'morning':
        return `Good morning${nameGreeting}`;
      case 'afternoon':
        return `Good afternoon${nameGreeting}`;
      case 'evening':
        return `Good evening${nameGreeting}`;
      case 'night':
        return `Good night${nameGreeting}`;
      default:
        return `Hello${nameGreeting}`;
    }
  }

  /**
   * Record a user's mood with the current timestamp and time period
   */
  static recordMood(mood: string): void {
    try {
      const existingRecordsJson = localStorage.getItem(MOOD_RECORDS_KEY);
      const existingRecords: MoodRecord[] = existingRecordsJson 
        ? JSON.parse(existingRecordsJson) 
        : [];

      // Add new mood record with current timestamp and time period
      const newRecord: MoodRecord = {
        mood,
        timestamp: new Date().toISOString(),
        timePeriod: this.getCurrentTimePeriod()
      };

      // Keep only the most recent 50 records to prevent storage bloat
      const updatedRecords = [newRecord, ...existingRecords].slice(0, 50);
      localStorage.setItem(MOOD_RECORDS_KEY, JSON.stringify(updatedRecords));
    } catch (error) {
      console.error('Error recording mood:', error);
    }
  }

  /**
   * Get the user's most frequently recorded mood for the current time period
   */
  static getMostFrequentMoodForCurrentTimePeriod(): string | null {
    try {
      const currentTimePeriod = this.getCurrentTimePeriod();
      const existingRecordsJson = localStorage.getItem(MOOD_RECORDS_KEY);
      
      if (!existingRecordsJson) return null;
      
      const existingRecords: MoodRecord[] = JSON.parse(existingRecordsJson);
      
      // Filter records for the current time period
      const timeFilteredRecords = existingRecords.filter(
        record => record.timePeriod === currentTimePeriod
      );
      
      if (timeFilteredRecords.length === 0) return null;
      
      // Count occurrences of each mood
      const moodCounts: Record<string, number> = {};
      timeFilteredRecords.forEach(record => {
        moodCounts[record.mood] = (moodCounts[record.mood] || 0) + 1;
      });
      
      // Find the mood with the highest occurrence
      let maxMood = null;
      let maxCount = 0;
      
      Object.entries(moodCounts).forEach(([mood, count]) => {
        if (count > maxCount) {
          maxMood = mood;
          maxCount = count;
        }
      });
      
      return maxMood;
    } catch (error) {
      console.error('Error getting most frequent mood:', error);
      return null;
    }
  }

  /**
   * Generate time-based recommendations based on current time period and user preferences
   */
  static getTimeBasedRecommendations(preferences: any = {}): TimeBasedRecommendations {
    const timePeriod = this.getCurrentTimePeriod();
    const preferredDuration = preferences.preferredSessionDuration || 10;
    
    // Base recommendations by time period
    const recommendations: TimeBasedRecommendations = {
      meditation: { title: "", duration: preferredDuration },
      breathing: { title: "", duration: Math.max(3, Math.floor(preferredDuration / 3)) },
      activity: { title: "", duration: preferredDuration }
    };
    
    // Adjust recommendations based on time period
    switch (timePeriod) {
      case 'morning':
        recommendations.meditation.title = "Morning Clarity";
        recommendations.breathing.title = "Energizing Breath";
        recommendations.activity.title = "Mindful Stretching";
        break;
        
      case 'afternoon':
        recommendations.meditation.title = "Midday Reset";
        recommendations.breathing.title = "Stress Relief Breathing";
        recommendations.activity.title = "Quick Focus Session";
        break;
        
      case 'evening':
        recommendations.meditation.title = "Evening Wind Down";
        recommendations.breathing.title = "Relaxing Breath";
        recommendations.activity.title = "Gentle Reflection";
        break;
        
      case 'night':
        recommendations.meditation.title = "Sleep Preparation";
        recommendations.breathing.title = "4-7-8 Sleep Breath";
        recommendations.activity.title = "Bedtime Relaxation";
        break;
    }
    
    // Customize by experience level
    if (preferences.meditationExperience === 'beginner') {
      recommendations.meditation.duration = Math.min(preferredDuration, 5);
      recommendations.breathing.duration = 3;
    } else if (preferences.meditationExperience === 'advanced') {
      recommendations.meditation.duration = Math.max(preferredDuration, 15);
    }
    
    // Customize by top mood issues if available
    if (preferences.focusChallenges?.includes('stress')) {
      recommendations.breathing.title = "Stress Reduction Breath";
    }
    
    if (preferences.focusChallenges?.includes('sleep')) {
      recommendations.meditation.title = "Better Sleep Meditation";
    }
    
    // Add personalization based on most frequent mood at this time period
    const frequentMood = this.getMostFrequentMoodForCurrentTimePeriod();
    if (frequentMood === 'anxious') {
      recommendations.breathing.title = "Anxiety Calming Breath";
    } else if (frequentMood === 'tired') {
      recommendations.breathing.title = "Energizing Breath";
      recommendations.meditation.title = "Revitalizing Meditation";
    } else if (frequentMood === 'calm') {
      recommendations.meditation.title = "Deepen Your Calm";
    }
    
    return recommendations;
  }
}
