import { UserPreferences } from '@/context/types';

export type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night';
export type MoodCorrelation = Record<string, Record<TimePeriod, number>>;

interface TimeAwarenessData {
  currentTimePeriod: TimePeriod;
  lastChecked: string;
  moodHistory: Array<{
    mood: string;
    timestamp: string;
    timePeriod: TimePeriod;
  }>;
}

/**
 * Service to handle time-based awareness and recommendations 
 */
export class TimeAwarenessService {
  /**
   * Get the current time period based on the hour
   */
  static getCurrentTimePeriod(): TimePeriod {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'morning';
    } else if (hour >= 12 && hour < 17) {
      return 'afternoon';
    } else if (hour >= 17 && hour < 22) {
      return 'evening';
    } else {
      return 'night';
    }
  }
  
  /**
   * Initialize or get the time awareness data
   */
  static getTimeAwarenessData(): TimeAwarenessData {
    const storedData = localStorage.getItem('timeAwarenessData');
    const currentTimePeriod = this.getCurrentTimePeriod();
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData) as TimeAwarenessData;
        // Update the time period if it changed
        if (parsedData.currentTimePeriod !== currentTimePeriod) {
          parsedData.currentTimePeriod = currentTimePeriod;
          parsedData.lastChecked = new Date().toISOString();
          this.saveTimeData(parsedData);
        }
        return parsedData;
      } catch (e) {
        console.error('Error parsing time awareness data:', e);
      }
    }
    
    // Initialize with default values
    const defaultData: TimeAwarenessData = {
      currentTimePeriod,
      lastChecked: new Date().toISOString(),
      moodHistory: []
    };
    
    this.saveTimeData(defaultData);
    return defaultData;
  }
  
  /**
   * Save time awareness data
   */
  static saveTimeData(data: TimeAwarenessData): void {
    localStorage.setItem('timeAwarenessData', JSON.stringify(data));
  }
  
  /**
   * Record a mood with the current time period
   */
  static recordMood(mood: string): void {
    const data = this.getTimeAwarenessData();
    const timePeriod = this.getCurrentTimePeriod();
    
    data.moodHistory.push({
      mood,
      timestamp: new Date().toISOString(),
      timePeriod
    });
    
    // Keep the history reasonably sized (last 30 entries)
    if (data.moodHistory.length > 30) {
      data.moodHistory = data.moodHistory.slice(-30);
    }
    
    this.saveTimeData(data);
  }
  
  /**
   * Get mood correlations by time period
   */
  static getMoodCorrelations(): MoodCorrelation {
    const data = this.getTimeAwarenessData();
    const correlation: MoodCorrelation = {};
    
    // Count occurrences of each mood by time period
    data.moodHistory.forEach(entry => {
      if (!correlation[entry.mood]) {
        correlation[entry.mood] = {
          morning: 0,
          afternoon: 0,
          evening: 0,
          night: 0
        };
      }
      correlation[entry.mood][entry.timePeriod]++;
    });
    
    return correlation;
  }
  
  /**
   * Get the most frequent mood for the current time period
   */
  static getMostFrequentMoodForCurrentTimePeriod(): string | null {
    const timePeriod = this.getCurrentTimePeriod();
    const correlations = this.getMoodCorrelations();
    
    let maxCount = 0;
    let mostFrequentMood: string | null = null;
    
    Object.entries(correlations).forEach(([mood, counts]) => {
      if (counts[timePeriod] > maxCount) {
        maxCount = counts[timePeriod];
        mostFrequentMood = mood;
      }
    });
    
    return mostFrequentMood;
  }
  
  /**
   * Get personalized recommendations based on time of day and user preferences
   */
  static getTimeBasedRecommendations(preferences: UserPreferences) {
    const timePeriod = this.getCurrentTimePeriod();
    const recentMood = this.getMostFrequentMoodForCurrentTimePeriod();
    
    // Different recommendations based on time period
    switch (timePeriod) {
      case 'morning':
        return {
          meditation: {
            title: "Morning Clarity",
            description: "Start your day with a clear mind",
            duration: 10,
            type: "guided"
          },
          breathing: {
            title: "Morning Energizer",
            description: "Breathwork to wake up naturally",
            technique: "energizing",
            duration: 5
          },
          activity: recentMood === "tired" ? "stretching" : "planning"
        };
        
      case 'afternoon':
        return {
          meditation: {
            title: "Midday Reset",
            description: "Refresh your mind for the afternoon",
            duration: 7,
            type: "focus"
          },
          breathing: {
            title: "Stress Relief",
            description: "Quick breathing exercise to reduce tension",
            technique: "box",
            duration: 3
          },
          activity: recentMood === "stressed" ? "short_walk" : "hydration"
        };
        
      case 'evening':
        return {
          meditation: {
            title: "Evening Wind Down",
            description: "Transition from work to relaxation",
            duration: 15,
            type: "relaxation"
          },
          breathing: {
            title: "Calm Breath",
            description: "Slow breathing to reduce evening anxiety",
            technique: "478",
            duration: 5
          },
          activity: recentMood === "anxious" ? "journaling" : "reading"
        };
        
      case 'night':
        return {
          meditation: {
            title: "Sleep Preparation",
            description: "Gentle meditation to prepare for sleep",
            duration: 20,
            type: "sleep"
          },
          breathing: {
            title: "Deep Relaxation",
            description: "Prepare your nervous system for sleep",
            technique: "coherent",
            duration: 7
          },
          activity: "screen_free_time"
        };
    }
  }
  
  /**
   * Get a greeting message based on current time period
   */
  static getTimeBasedGreeting(userName: string = ""): string {
    const timePeriod = this.getCurrentTimePeriod();
    const name = userName ? `, ${userName}` : "";
    
    switch (timePeriod) {
      case 'morning':
        return `Good morning${name}`;
      case 'afternoon':
        return `Good afternoon${name}`;
      case 'evening':
        return `Good evening${name}`;
      case 'night':
        return `Good night${name}`;
      default:
        return `Hello${name}`;
    }
  }
}
