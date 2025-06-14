
export interface TimeBasedRecommendations {
  morning: string[];
  afternoon: string[];
  evening: string[];
  night: string[];
}

export interface TimeAwarenessData {
  currentPeriod: 'morning' | 'afternoon' | 'evening' | 'night';
  recommendations: string[];
  optimalTimes: {
    meditation: string;
    breathing: string;
    focus: string;
  };
}

export class TimeAwarenessService {
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

  getCurrentTimeAwareness(): TimeAwarenessData {
    const hour = new Date().getHours();
    let currentPeriod: 'morning' | 'afternoon' | 'evening' | 'night';
    
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
export { TimeBasedRecommendations };
