import { WorkDay } from '@/context/types';

// Enhanced work-life balance data structure with breathing technique context
export interface EnhancedWorkLifePreferences {
  // Existing core structure
  workingDays: WorkDay[];
  workingHours: {
    start: string; // '09:00'
    end: string;   // '17:00'
  };
  lunchBreak: {
    duration: number; // minutes
    time: string;     // '12:00'
  };

  // NEW: Breathing technique context
  workStressors: WorkStressor[];
  stressfulTimes: StressfulTime[];
  currentCopingMethods: CopingMethod[];
  preferredBreakLength: BreakLength;

  // Optional: Additional context for personalization
  workEnvironment?: 'office' | 'home' | 'hybrid' | 'co-working' | 'outdoor';
  stressLevel?: 'low' | 'moderate' | 'high' | 'varies';
  energyPatterns?: {
    morningEnergy: 'low' | 'medium' | 'high';
    afternoonDip: boolean;
    eveningEnergy: 'low' | 'medium' | 'high';
  };

  // Breathing preferences
  breathingPreferences?: {
    preferredTechniques: BreathingTechnique[];
    guidedVsUnguided: 'guided' | 'unguided' | 'both';
    backgroundSounds: boolean;
    voicePreference?: 'male' | 'female' | 'neutral';
  };
}

// Work stressors that can trigger breathing sessions
export type WorkStressor =
  | 'deadlines'
  | 'meetings'
  | 'multitasking'
  | 'interruptions'
  | 'email-overload'
  | 'difficult-conversations'
  | 'technical-issues'
  | 'workload'
  | 'uncertainty'
  | 'conflict'
  | 'presentations'
  | 'decision-making'
  | 'time-pressure';

// Times during work day when stress typically peaks
export type StressfulTime =
  | 'morning-rush'
  | 'pre-meetings'
  | 'mid-morning'
  | 'pre-lunch'
  | 'post-lunch'
  | 'mid-afternoon'
  | 'end-of-day'
  | 'overtime'
  | 'monday-mornings'
  | 'friday-afternoons';

// Current methods user employs to cope with stress
export type CopingMethod =
  | 'coffee'
  | 'short-walks'
  | 'deep-breaths'
  | 'social-chat'
  | 'music'
  | 'stretching'
  | 'water-break'
  | 'snacking'
  | 'none'
  | 'meditation'
  | 'exercise'
  | 'fresh-air';

// Preferred break durations for breathing exercises
export type BreakLength =
  | '1-minute'    // Quick reset
  | '2-minutes'   // Standard micro-break
  | '5-minutes'   // Extended break
  | '10-minutes'  // Deep session
  | 'flexible';   // Adaptive to situation

// Breathing techniques suitable for work environments
export type BreathingTechnique =
  | 'box-breathing'        // 4-4-4-4 pattern
  | 'triangular-breathing' // 4-4-8 pattern
  | 'coherent-breathing'   // 5-5 pattern
  | 'alternate-nostril'    // Nadi Shodhana
  | 'belly-breathing'      // Diaphragmatic
  | 'quick-coherence'      // HeartMath technique
  | 'four-seven-eight'     // 4-7-8 pattern
  | 'tactical-breathing'   // Military technique
  | 'physiological-sigh';  // Double inhale + long exhale

// Smart break recommendations based on user data
export interface BreakRecommendation {
  id: string;
  triggerType: 'scheduled' | 'stress-detected' | 'user-requested';
  suggestedTechnique: BreathingTechnique;
  duration: number; // in minutes
  reasoning: string; // Why this technique at this time
  priority: 'low' | 'medium' | 'high' | 'urgent';
  context?: {
    currentStressor?: WorkStressor;
    timeOfDay: string;
    workloadLevel?: 'light' | 'moderate' | 'heavy';
    nextMeetingIn?: number; // minutes
  };
}

// Session tracking for work-integrated breathing
export interface WorkBreathingSession {
  id: string;
  userId: string;
  technique: BreathingTechnique;
  duration: number; // actual duration in seconds
  scheduledDuration: number; // planned duration in seconds
  startTime: string; // ISO timestamp
  endTime?: string; // ISO timestamp

  // Context when session was started
  trigger: {
    type: 'scheduled' | 'stress-response' | 'manual';
    stressor?: WorkStressor;
    stressfulTime?: StressfulTime;
  };

  // User feedback
  stressBefore?: number; // 1-10 scale
  stressAfter?: number;  // 1-10 scale
  energyBefore?: number; // 1-10 scale
  energyAfter?: number;  // 1-10 scale

  effectiveness?: number; // 1-5 scale
  willUseAgain?: boolean;
  notes?: string;

  // Session metrics
  breathsPerMinute?: number;
  heartRateVariability?: number; // if available from device
  completed: boolean;

  createdAt: string;
  updatedAt: string;
}

// Analytics for understanding work stress patterns
export interface WorkStressAnalytics {
  userId: string;
  period: 'day' | 'week' | 'month';

  // Stress patterns
  commonStressors: Array<{
    stressor: WorkStressor;
    frequency: number;
    averageIntensity: number;
  }>;

  stressfulTimePatterns: Array<{
    time: StressfulTime;
    frequency: number;
    averageIntensity: number;
  }>;

  // Effectiveness tracking
  techniqueEffectiveness: Array<{
    technique: BreathingTechnique;
    usageCount: number;
    averageEffectiveness: number;
    stressReduction: number; // average stress before - after
  }>;

  // Improvement metrics
  overallStressReduction: number;
  sessionsCompleted: number;
  streakDays: number;

  // Recommendations
  suggestedImprovements: string[];
  personalizedTechniques: BreathingTechnique[];

  generatedAt: string;
}

// Integration with existing break reminder system
export interface EnhancedBreakReminder {
  id: string;
  type: 'micro' | 'medium' | 'lunch' | 'long' | 'breathing';
  enabled: boolean;
  interval?: number; // for recurring breaks
  scheduledTime?: string; // for fixed-time breaks like lunch

  // Breathing-specific properties
  defaultTechnique?: BreathingTechnique;
  adaptiveRecommendations?: boolean; // Use AI to suggest techniques
  stressThreshold?: number; // Auto-trigger if stress detected above this level

  // Context awareness
  skipDuringMeetings?: boolean;
  skipWhenFocused?: boolean; // Skip if user is in deep work
  weekdaysOnly?: boolean;
}