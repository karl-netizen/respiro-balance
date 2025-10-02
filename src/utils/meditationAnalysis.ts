/**
 * Meditation state analysis utilities
 */

export interface HeartRateDataPoint {
  hr: number;
  time: number;
}

// Alias for backward compatibility
export type HeartRateReading = HeartRateDataPoint;

export interface MeditationState {
  state: 'deep-meditation' | 'relaxed' | 'focused' | 'active' | 'warming-up' | 'neutral';
  confidence: number;
  avgHR: number;
  hrVariability: number;
  trend: number;
}

export interface BreathingGuidance {
  inhale: number;
  hold: number;
  exhale: number;
  message: string;
}

/**
 * Analyze meditation state based on heart rate data
 */
export const analyzeMeditationState = (hrData: HeartRateDataPoint[]): MeditationState => {
  if (hrData.length < 10) {
    return { 
      state: 'warming-up', 
      confidence: 0,
      avgHR: 0,
      hrVariability: 0,
      trend: 0
    };
  }

  const recent = hrData.slice(-30);
  const avgHR = recent.reduce((sum, d) => sum + d.hr, 0) / recent.length;
  const hrVariability = calculateHRV(recent);
  const trend = calculateTrend(recent);

  let state: MeditationState['state'] = 'neutral';
  let confidence = 0;

  if (avgHR < 65 && hrVariability > 50 && Math.abs(trend) < 0.5) {
    state = 'deep-meditation';
    confidence = 85;
  } else if (avgHR < 75 && hrVariability > 40 && trend < 0) {
    state = 'relaxed';
    confidence = 75;
  } else if (avgHR >= 65 && avgHR <= 80 && Math.abs(trend) < 1) {
    state = 'focused';
    confidence = 70;
  } else if (avgHR > 80 || trend > 1) {
    state = 'active';
    confidence = 65;
  }

  return { state, confidence, avgHR, hrVariability, trend };
};

/**
 * Calculate Heart Rate Variability
 */
export const calculateHRV = (data: HeartRateDataPoint[]): number => {
  if (data.length < 2) return 0;
  
  const differences: number[] = [];
  for (let i = 1; i < data.length; i++) {
    differences.push(Math.abs(data[i].hr - data[i-1].hr));
  }
  
  return differences.reduce((sum, d) => sum + d, 0) / differences.length;
};

/**
 * Calculate heart rate trend
 */
export const calculateTrend = (data: HeartRateDataPoint[]): number => {
  if (data.length < 5) return 0;
  
  const recent = data.slice(-10);
  const first = recent.slice(0, 5).reduce((sum, d) => sum + d.hr, 0) / 5;
  const last = recent.slice(-5).reduce((sum, d) => sum + d.hr, 0) / 5;
  
  return last - first;
};

/**
 * Get breathing guidance based on meditation state
 */
export const getBreathingGuidance = (meditationState: MeditationState['state']): BreathingGuidance => {
  const guidance: Record<MeditationState['state'], BreathingGuidance> = {
    'deep-meditation': { 
      inhale: 4, 
      hold: 7, 
      exhale: 8, 
      message: 'Perfect! Maintain this deep state' 
    },
    'relaxed': { 
      inhale: 4, 
      hold: 4, 
      exhale: 6, 
      message: 'Great relaxation, keep going' 
    },
    'focused': { 
      inhale: 4, 
      hold: 2, 
      exhale: 6, 
      message: 'Good focus, breathe deeper' 
    },
    'active': { 
      inhale: 4, 
      hold: 0, 
      exhale: 8, 
      message: 'Take slow deep breaths to calm' 
    },
    'warming-up': { 
      inhale: 4, 
      hold: 0, 
      exhale: 4, 
      message: 'Begin with natural breathing' 
    },
    'neutral': {
      inhale: 4,
      hold: 0,
      exhale: 4,
      message: 'Find your natural rhythm'
    }
  };
  
  return guidance[meditationState] || guidance['warming-up'];
};

/**
 * Get state color classes
 */
export const getStateColorClasses = (state: MeditationState['state']): string => {
  const colors: Record<MeditationState['state'], string> = {
    'deep-meditation': 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950',
    'relaxed': 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950',
    'focused': 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950',
    'active': 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950',
    'warming-up': 'text-muted-foreground bg-muted',
    'neutral': 'text-muted-foreground bg-muted'
  };
  
  return colors[state] || colors['warming-up'];
};

/**
 * Format seconds to MM:SS
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
