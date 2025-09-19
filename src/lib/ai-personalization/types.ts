// ===================================================================
// AI-POWERED PERSONALIZATION ENGINE TYPES FOR RESPIRO BALANCE
// ===================================================================

import { Brand } from '../advanced-patterns';

// Branded types for AI system
export type PersonalizationProfileId = Brand<string, 'PersonalizationProfileId'>;
export type SessionRecommendationId = Brand<string, 'SessionRecommendationId'>;
export type MoodAnalysisId = Brand<string, 'MoodAnalysisId'>;
export type LearningModelId = Brand<string, 'LearningModelId'>;

// User behavior and preference types
export interface UserBehaviorData {
  userId: string;
  sessionHistory: SessionActivity[];
  preferenceData: UserPreferences;
  biometricData: BiometricReading[];
  moodHistory: MoodEntry[];
  contextualData: ContextualFactors;
  deviceUsagePatterns: DeviceUsagePattern[];
}

export interface SessionActivity {
  sessionId: string;
  sessionType: 'meditation' | 'breathing' | 'focus' | 'sleep' | 'stress_relief';
  duration: number; // in minutes
  completionRate: number; // 0-1
  userRating: number; // 1-5 stars
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioGuide: string | null;
  backgroundSounds: string | null;
  timestamp: Date;
  preSessionMood: number; // 1-10
  postSessionMood: number; // 1-10
  environmentalFactors: {
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    location: 'home' | 'office' | 'outdoors' | 'other';
    stressLevel: number; // 1-10
    energyLevel: number; // 1-10
  };
}

export interface UserPreferences {
  preferredSessionLength: number[]; // [5, 10, 15, 20, 30] minutes
  preferredTimes: string[]; // ['morning', 'lunch', 'evening']
  favoriteGuides: string[]; // Guide IDs
  preferredDifficulty: 'beginner' | 'intermediate' | 'advanced' | 'adaptive';
  backgroundSoundPreference: 'nature' | 'ambient' | 'silence' | 'adaptive';
  voiceSpeed: 'slow' | 'normal' | 'fast';
  reminderFrequency: 'daily' | 'weekdays' | 'custom' | 'none';
  goals: PersonalGoal[];
  avoidedTriggers: string[]; // Anxiety triggers, etc.
}

export interface PersonalGoal {
  id: string;
  type: 'stress_reduction' | 'better_sleep' | 'focus_improvement' | 'emotional_balance' | 'habit_building';
  priority: 'high' | 'medium' | 'low';
  targetValue: number;
  currentProgress: number;
  timeframe: 'daily' | 'weekly' | 'monthly';
  createdAt: Date;
}

export interface BiometricReading {
  timestamp: Date;
  heartRate?: number;
  heartRateVariability?: number;
  stressScore?: number; // 0-100
  recoveryScore?: number; // 0-100
  sleepQuality?: number; // 0-100
  respiratoryRate?: number;
}

export interface MoodEntry {
  timestamp: Date;
  overallMood: number; // 1-10
  anxiety: number; // 1-10
  stress: number; // 1-10
  energy: number; // 1-10
  focus: number; // 1-10
  notes?: string;
  triggers?: string[];
}

export interface ContextualFactors {
  timezone: string;
  workSchedule: {
    workDays: string[];
    startTime: string;
    endTime: string;
  };
  sleepSchedule: {
    bedtime: string;
    wakeTime: string;
  };
  lifestyle: 'sedentary' | 'moderately_active' | 'very_active';
  stressors: string[];
  lifeEvents: LifeEvent[];
}

export interface LifeEvent {
  type: 'work_deadline' | 'travel' | 'illness' | 'relationship' | 'family' | 'other';
  impact: 'positive' | 'negative' | 'neutral';
  intensity: number; // 1-10
  startDate: Date;
  endDate?: Date;
  description: string;
}

export interface DeviceUsagePattern {
  date: Date;
  totalUsageTime: number; // minutes
  sessionCount: number;
  peakUsageTimes: string[]; // Hour ranges
  averageSessionLength: number;
  completionRate: number;
  mostUsedFeatures: string[];
}

export interface SessionRecommendation {
  id: SessionRecommendationId;
  sessionType: SessionActivity['sessionType'];
  title: string;
  description: string;
  duration: number;
  difficulty: SessionActivity['difficulty'];
  audioGuide?: string;
  backgroundSound?: string;
  confidence: number; // 0-1 (how confident the AI is)
  reasoning: string[];
  personalizedElements: PersonalizedElement[];
  expectedBenefit: {
    moodImprovement: number; // Expected mood boost 1-10
    stressReduction: number; // Expected stress reduction 1-10
    focusImprovement: number; // Expected focus improvement 1-10
  };
  tags: string[];
}

export interface PersonalizedElement {
  type: 'duration' | 'guide_voice' | 'background_sound' | 'difficulty' | 'timing' | 'content_focus';
  value: string | number;
  reason: string;
}

export interface ContextAnalysis {
  currentMood: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: number;
  stressLevel: number;
  energyLevel: number;
  availableTime: number;
  recentSessionPatterns: any;
  preferredTimeMatch: number;
  immediateGoal?: string;
}

export interface ModelWeights {
  moodInfluence: number;
  timeOfDayInfluence: number;
  sessionHistoryInfluence: number;
  biometricInfluence: number;
  contextualInfluence: number;
  personalPreferences: {
    sessionType: number;
    duration: number;
    difficulty: number;
    audioPreference: number;
  };
  goalAlignment: number;
  adaptationSpeed: number;
}

export interface SessionFeedback {
  rating: number;
  completed: boolean;
  helpful: boolean;
  comments?: string;
}