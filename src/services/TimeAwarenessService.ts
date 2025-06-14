
export type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night';

export interface TimeBasedRecommendations {
  morning: string[];
  afternoon: string[];
  evening: string[];
  night: string[];
}

export interface TimeAwarenessData {
  currentPeriod: TimePeriod;
  recommendations: string[];
  optimalTimes: {
    meditation: string;
    breathing: string;
    focus: string;
  };
}

export interface RecommendationData {
  meditation: { title: string; duration: number };
  breathing: { title: string; duration: number };
  activity: { title: string; duration: number };
}

export class TimeAwarenessService {
  private static moodHistory: { [key: string]: string[] } = {
    morning: [],
    afternoon: [],
    evening: [],
    night: []
  };

  private getTimeBasedRecommendations(): TimeBasedRecommendations {
    return {
      morning: [
        'Start with an energizing morning meditation',
        'Practice breathing exercises to set intention',
        'Begin your day with focused work sessions'
      ],
      afternoon: [
        'Take a mindful break to reset your energy',
        'Try a short stress-relief breathing exercise',
        'Use focus mode for important tasks'
      ],
      evening: [
        'Wind down with a calming meditation',
        'Practice gratitude and reflection',
        'Prepare for restful sleep'
      ],
      night: [
        'Use sleep meditation for better rest',
        'Practice deep relaxation techniques',
        'Set intentions for tomorrow'
      ]
    };
  }

  static getCurrentTimePeriod(): TimePeriod {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) {
      return 'morning';
    } else if (hour >= 12 && hour < 17) {
      return 'afternoon';
    } else if (hour >= 17 && hour < 22) {
      return 'evening';
    } else {
      return 'night';
    }
  }

  static getTimeBasedRecommendations(preferences?: any): RecommendationData {
    const period = this.getCurrentTimePeriod();
    const duration = preferences?.preferred_session_duration || 10;
    
    const recommendations = {
      morning: {
        meditation: { title: 'Morning Awakening', duration },
        breathing: { title: 'Energizing Breath', duration: Math.max(3, Math.floor(duration / 3)) },
        activity: { title: 'Morning Stretch', duration }
      },
      afternoon: {
        meditation: { title: 'Midday Reset', duration },
        breathing: { title: 'Stress Relief', duration: Math.max(3, Math.floor(duration / 3)) },
        activity: { title: 'Walking Meditation', duration }
      },
      evening: {
        meditation: { title: 'Evening Calm', duration },
        breathing: { title: 'Wind Down Breath', duration: Math.max(3, Math.floor(duration / 3)) },
        activity: { title: 'Gentle Yoga', duration }
      },
      night: {
        meditation: { title: 'Sleep Preparation', duration },
        breathing: { title: 'Deep Relaxation', duration: Math.max(3, Math.floor(duration / 3)) },
        activity: { title: 'Body Scan', duration }
      }
    };

    return recommendations[period];
  }

  static recordMood(mood: string): void {
    const period = this.getCurrentTimePeriod();
    if (!this.moodHistory[period]) {
      this.moodHistory[period] = [];
    }
    this.moodHistory[period].push(mood);
    
    // Keep only last 10 entries per period
    if (this.moodHistory[period].length > 10) {
      this.moodHistory[period] = this.moodHistory[period].slice(-10);
    }
  }

  static getMostFrequentMoodForCurrentTimePeriod(): string | null {
    const period = this.getCurrentTimePeriod();
    const moods = this.moodHistory[period] || [];
    
    if (moods.length === 0) return null;
    
    const moodCounts = moods.reduce((acc, mood) => {
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || null;
  }

  static getTimeBasedGreeting(userName: string = ''): string {
    const period = this.getCurrentTimePeriod();
    const name = userName ? `, ${userName}` : '';
    
    const greetings = {
      morning: `Good morning${name}! Ready to start your day mindfully?`,
      afternoon: `Good afternoon${name}! Time for a mindful break?`,
      evening: `Good evening${name}! Let's wind down together.`,
      night: `Good night${name}! Ready for some restful preparation?`
    };
    
    return greetings[period];
  }

  getCurrentTimeAwareness(): TimeAwarenessData {
    const hour = new Date().getHours();
    let currentPeriod: TimePeriod;
    
    if (hour >= 6 && hour < 12) {
      currentPeriod = 'morning';
    } else if (hour >= 12 && hour < 17) {
      currentPeriod = 'afternoon';
    } else if (hour >= 17 && hour < 22) {
      currentPeriod = 'evening';
    } else {
      currentPeriod = 'night';
    }

    const allRecommendations = this.getTimeBasedRecommendations();
    
    return {
      currentPeriod,
      recommendations: allRecommendations[currentPeriod],
      optimalTimes: {
        meditation: currentPeriod === 'morning' ? '07:00' : currentPeriod === 'evening' ? '19:00' : '12:00',
        breathing: currentPeriod === 'afternoon' ? '14:00' : '08:00',
        focus: currentPeriod === 'morning' ? '09:00' : '10:00'
      }
    };
  }
}

export const timeAwarenessService = new TimeAwarenessService();
