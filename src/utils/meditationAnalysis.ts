export interface HeartRateReading {
  hr: number;
  time: number;
}

export interface MeditationState {
  state: 'deep-meditation' | 'relaxed' | 'focused' | 'active' | 'warming-up';
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

export const analyzeMeditationState = (hrData: HeartRateReading[]): MeditationState => {
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

  let state: MeditationState['state'] = 'warming-up';
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

export const calculateHRV = (data: HeartRateReading[]): number => {
  if (data.length < 2) return 0;
  const differences = [];
  for (let i = 1; i < data.length; i++) {
    differences.push(Math.abs(data[i].hr - data[i - 1].hr));
  }
  return differences.reduce((sum, d) => sum + d, 0) / differences.length;
};

export const calculateTrend = (data: HeartRateReading[]): number => {
  if (data.length < 5) return 0;
  const recent = data.slice(-10);
  const first = recent.slice(0, 5).reduce((sum, d) => sum + d.hr, 0) / 5;
  const last = recent.slice(-5).reduce((sum, d) => sum + d.hr, 0) / 5;
  return last - first;
};

export const getBreathingGuidance = (meditationState: MeditationState['state']): BreathingGuidance => {
  const guidance: Record<MeditationState['state'], BreathingGuidance> = {
    'deep-meditation': { inhale: 4, hold: 7, exhale: 8, message: 'Perfect! Maintain this deep state' },
    'relaxed': { inhale: 4, hold: 4, exhale: 6, message: 'Great relaxation, keep going' },
    'focused': { inhale: 4, hold: 2, exhale: 6, message: 'Good focus, breathe deeper' },
    'active': { inhale: 4, hold: 0, exhale: 8, message: 'Take slow deep breaths to calm' },
    'warming-up': { inhale: 4, hold: 0, exhale: 4, message: 'Begin with natural breathing' }
  };
  return guidance[meditationState] || guidance['warming-up'];
};
