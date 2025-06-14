
import { UserPreferences } from '@/context/types';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';

export interface ContextualRecommendation {
  id: string;
  type: 'meditation' | 'breathing' | 'focus' | 'ritual' | 'social';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  action: string;
  module: string;
  route: string;
  confidence: number;
  reasons: string[];
  biometricTrigger?: string;
  timeRelevant?: boolean;
}

export interface AnalysisContext {
  userPreferences: UserPreferences | null;
  recentBiometrics: BiometricData[];
  sessionHistory: any[];
  currentTime: Date;
}

export interface Analyzer {
  analyze(context: AnalysisContext): ContextualRecommendation[];
}
