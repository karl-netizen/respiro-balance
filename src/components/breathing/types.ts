
export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

export interface BreathingSession {
  id: string;
  technique: string;
  duration: number;
  completed_at: string;
}

export interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  pattern: string;
  inhale: number;
  hold?: number;
  exhale: number;
  rest?: number;
  benefits: string[];
  color: string;
}
