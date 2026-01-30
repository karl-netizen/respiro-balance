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

  // Work context (from previous implementation)
  workStressors: WorkStressor[];
  stressfulTimes: StressfulTime[];
  currentCopingMethods: CopingMethod[];
  preferredBreakLength: BreakLength;

  // Work environment context
  workEnvironment?: 'office' | 'home' | 'hybrid' | 'co-working' | 'outdoor';
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

  // NEW: Health and wellness assessment
  stressAssessment?: StressAssessment;
  breathingAwareness?: BreathingAwareness;
  wellnessGoals?: WellnessGoals;
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
  | 'box-breathing-variation' // Box breathing variation
  | 'triangular-breathing' // 4-4-8 pattern
  | 'coherent-breathing'   // 5-5 pattern
  | 'alternate-nostril'    // Nadi Shodhana
  | 'belly-breathing'      // Diaphragmatic
  | 'quick-coherence'      // HeartMath technique
  | 'four-seven-eight'     // 4-7-8 pattern
  | 'tactical-breathing'   // Military technique
  | 'physiological-sigh'   // Double inhale + long exhale
  | 'wim-hof'              // Wim Hof breathing method
  | 'breath-of-fire'       // Kundalini breathing technique
  | 'extended-exhale'      // Long exhale for relaxation
  | 'resonance-breathing'  // Resonance frequency breathing
  | 'ocean-breath'         // Ujjayi pranayama
  | 'lions-breath';        // Simhasana pranayama

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

// NEW: Health and wellness assessment interfaces

// Comprehensive stress assessment
export interface StressAssessment {
  currentStressLevel: number; // 1-10 scale
  stressFrequency: StressFrequency;
  physicalStressSymptoms: PhysicalStressSymptom[];

  // Stress triggers beyond work
  personalStressors?: PersonalStressor[];
  stressTriggerTimes?: StressTriggerTime[];

  // Stress impact assessment
  stressImpactAreas?: StressImpactArea[];
  copingEffectiveness?: CopingEffectiveness;

  // Timeline tracking
  assessmentDate: string;
  previousAssessments?: Partial<StressAssessment>[];
}

// Breathing awareness and issues
export interface BreathingAwareness {
  breathingAwareness: BreathingAwarenessLevel;
  breathingIssues: BreathingIssue[];
  previousBreathingExperience: ExperienceLevel;

  // Breathing pattern details
  typicalBreathingPatterns?: BreathingPattern[];
  breathingTriggerSituations?: BreathingTriggerSituation[];

  // Breathing goals and interests
  breathingInterests?: BreathingInterest[];
  learningPreferences?: LearningPreference[];

  // Progress tracking
  selfReportedProgress?: BreathingProgress;
  assessmentDate: string;
}

// Goal-based personalization
export interface WellnessGoals {
  primaryGoals: WellnessGoal[];
  secondaryGoals: WellnessGoal[];

  // Goal priorities and timeline
  goalPriorities?: { goal: WellnessGoal; priority: number }[];
  timeframe?: GoalTimeframe;

  // Success metrics
  successMetrics?: GoalMetric[];
  currentProgress?: { goal: WellnessGoal; progress: number }[];

  // Motivation and context
  motivationLevel?: MotivationLevel;
  availableTimePerDay?: number; // minutes per day for breathing practice
  consistencyPreference?: ConsistencyPreference;

  goalSetDate: string;
  reviewDate?: string;
}

// Stress Assessment Types
export type StressFrequency =
  | 'rarely'      // Once a month or less
  | 'weekly'      // A few times per month
  | 'daily'       // Most days
  | 'constantly'; // Throughout the day

export type PhysicalStressSymptom =
  | 'tension'           // Muscle tension, especially neck/shoulders
  | 'headaches'         // Tension or stress headaches
  | 'fatigue'           // Feeling tired or drained
  | 'shallow-breathing' // Notice breathing is shallow
  | 'digestive-issues'  // Stomach problems, loss of appetite
  | 'sleep-problems'    // Trouble falling asleep or staying asleep
  | 'heart-racing'      // Increased heart rate or palpitations
  | 'sweating'          // Stress-related sweating
  | 'restlessness'      // Feeling fidgety or unable to sit still
  | 'immune-issues'     // Getting sick more often
  | 'none';             // No physical symptoms noticed

export type PersonalStressor =
  | 'relationships'     // Family, friends, romantic relationships
  | 'finances'          // Money concerns, debt, budgeting
  | 'health'            // Personal or family health issues
  | 'major-life-changes' // Moving, job changes, life transitions
  | 'social-situations' // Social anxiety, public speaking
  | 'news-media'        // Current events, social media
  | 'perfectionism'     // Self-imposed high standards
  | 'uncertainty'       // Future planning, unknown outcomes
  | 'time-management'   // Feeling rushed, scheduling conflicts
  | 'technology'        // Digital overwhelm, screen time;

export type StressTriggerTime =
  | 'wake-up'           // First thing in the morning
  | 'commute'           // Travel to work
  | 'before-meals'      // When hungry or before eating
  | 'evening-wind-down' // Trying to relax after work
  | 'bedtime'           // When trying to fall asleep
  | 'weekends'          // During supposed relaxation time
  | 'social-events'     // Before or during social gatherings
  | 'decision-making'   // When facing choices or decisions
  | 'waiting-periods'   // When waiting for results or responses
  | 'transitions';      // Between activities or locations

export type StressImpactArea =
  | 'work-performance'  // Productivity, decision-making at work
  | 'relationships'     // Interactions with family, friends, colleagues
  | 'sleep-quality'     // Falling asleep, staying asleep, sleep depth
  | 'physical-health'   // Energy levels, physical symptoms
  | 'mood-emotional'    // Irritability, anxiety, mood swings
  | 'cognitive-function' // Memory, focus, mental clarity
  | 'appetite-eating'   // Food choices, eating patterns
  | 'motivation'        // Drive to pursue goals or activities
  | 'social-engagement' // Desire to spend time with others
  | 'self-care';        // Personal hygiene, health habits

export type CopingEffectiveness =
  | 'very-effective'    // Current methods work well
  | 'somewhat-effective' // Methods help but could be better
  | 'minimally-effective' // Methods provide little relief
  | 'not-effective'     // Current methods don't help
  | 'no-current-methods'; // No specific coping strategies

// Breathing Awareness Types
export type BreathingAwarenessLevel =
  | 'never-think-about' // Rarely conscious of breathing
  | 'sometimes-notice'  // Occasionally aware of breath patterns
  | 'often-aware'       // Frequently notice breathing
  | 'very-aware';       // Highly conscious of breathing patterns

export type BreathingIssue =
  | 'shallow'           // Breathing feels too shallow or in chest only
  | 'irregular'         // Breathing rhythm is inconsistent
  | 'breath-holding'    // Tendency to hold breath during stress/focus
  | 'rapid'             // Breathing too fast, feeling breathless
  | 'effortful'         // Breathing feels like work or forced
  | 'mouth-breathing'   // Primarily breathing through mouth
  | 'interrupted'       // Breathing gets interrupted by stress/anxiety
  | 'unsatisfying'      // Breathing doesn't feel fulfilling
  | 'none';             // No specific breathing issues noticed

export type ExperienceLevel =
  | 'beginner'          // Little to no experience with breathing techniques
  | 'some-experience'   // Tried breathing exercises occasionally
  | 'experienced';      // Regular practice with breathing techniques

export type BreathingPattern =
  | 'chest-breathing'   // Primarily using chest for breathing
  | 'belly-breathing'   // Using diaphragm for breathing
  | 'mixed-breathing'   // Combination of chest and belly
  | 'reverse-breathing' // Belly contracts on inhale (dysfunctional pattern)
  | 'upper-chest-only'  // Very shallow, only upper chest movement
  | 'sighing-pattern'   // Frequent sighs or deep breaths to "catch up"
  | 'variable-depth'    // Inconsistent depth of breaths
  | 'pause-between'     // Natural pauses between inhale and exhale;

export type BreathingTriggerSituation =
  | 'stress-response'   // Breathing changes during stress
  | 'focus-tasks'       // Breath holding during concentration
  | 'physical-activity' // Difficulty with breath during exercise
  | 'sleep-transition'  // Breathing issues when trying to sleep
  | 'anxiety-moments'   // Breathing becomes difficult during anxiety
  | 'public-speaking'   // Breath control issues during presentations
  | 'emotional-situations' // Breathing affected by strong emotions
  | 'cold-weather'      // Breathing changes in cold environments
  | 'air-quality'       // Sensitivity to air quality or allergens;

export type BreathingInterest =
  | 'stress-relief'     // Primary interest in stress reduction
  | 'performance'       // Breathing for physical or mental performance
  | 'meditation'        // Breathing as part of meditation practice
  | 'sleep-improvement' // Using breath for better sleep
  | 'anxiety-management' // Breathing for anxiety control
  | 'energy-boost'      // Breathing for increased energy/alertness
  | 'pain-management'   // Breathing to help with physical discomfort
  | 'emotional-regulation' // Breathing for mood and emotional balance
  | 'spiritual-practice' // Breathing as spiritual or religious practice
  | 'general-wellness'; // Overall health and wellness benefits

export type LearningPreference =
  | 'visual-cues'       // Prefer visual guides and animations
  | 'audio-guidance'    // Prefer spoken instructions
  | 'haptic-feedback'   // Prefer vibration or touch cues
  | 'written-instructions' // Prefer text-based guidance
  | 'video-demonstration' // Prefer video examples
  | 'live-instruction'  // Prefer real-time coaching
  | 'self-guided'       // Prefer to learn independently
  | 'progressive-lessons' // Prefer structured, building curriculum
  | 'quick-techniques'  // Prefer short, immediate techniques
  | 'deep-learning';    // Prefer comprehensive, detailed instruction

export type BreathingProgress =
  | 'no-change'         // Haven't noticed any changes yet
  | 'slight-improvement' // Small positive changes
  | 'moderate-improvement' // Noticeable positive changes
  | 'significant-improvement' // Major positive changes
  | 'varies-by-day'     // Progress is inconsistent
  | 'getting-worse'     // Feeling worse than before
  | 'plateau'           // Was improving but progress has stalled
  | 'new-awareness';    // More aware of breathing (good or challenging)

// Wellness Goals Types
export type WellnessGoal =
  | 'reduce-stress'     // Primary stress reduction
  | 'improve-focus'     // Better concentration and attention
  | 'better-sleep'      // Improved sleep quality and duration
  | 'increase-energy'   // More energy throughout the day
  | 'anxiety-management' // Managing anxiety and worry
  | 'pain-relief'       // Reducing physical discomfort
  | 'athletic-performance' // Improving physical performance
  | 'emotional-balance' // Better emotional regulation
  | 'blood-pressure'    // Managing blood pressure
  | 'respiratory-health' // Improving lung function and capacity
  | 'meditation-support' // Supporting meditation practice
  | 'anger-management'  // Managing anger and frustration
  | 'habit-formation'   // Building healthy daily habits
  | 'cognitive-enhancement' // Improving memory and mental clarity
  | 'spiritual-growth'  // Supporting spiritual or religious practice
  | 'social-confidence' // Reducing social anxiety
  | 'creative-flow'     // Enhancing creativity and flow states
  | 'addiction-recovery' // Supporting recovery from addictions
  | 'chronic-condition-support' // Supporting management of chronic illness
  | 'general-wellness'; // Overall health and wellbeing

export type GoalTimeframe =
  | 'immediate'         // Results needed right away (within days)
  | 'short-term'        // 1-4 weeks
  | 'medium-term'       // 1-3 months
  | 'long-term'         // 3-12 months
  | 'lifestyle-change'  // Permanent habit integration
  | 'flexible';         // No specific timeline

export type GoalMetric =
  | 'stress-level-scale' // 1-10 stress level tracking
  | 'sleep-quality'     // Sleep quality ratings
  | 'energy-levels'     // Daily energy ratings
  | 'mood-tracking'     // Emotional state monitoring
  | 'physical-symptoms' // Reduction in physical symptoms
  | 'frequency-of-use'  // How often breathing techniques are used
  | 'session-duration'  // Length of breathing practice sessions
  | 'technique-mastery' // Proficiency with different techniques
  | 'consistency'       // Regular practice maintenance
  | 'subjective-wellbeing' // Overall sense of wellbeing
  | 'performance-metrics' // Specific performance indicators
  | 'biomarkers'        // Measurable health indicators (HRV, BP, etc.)
  | 'behavioral-changes' // Changes in daily habits and responses
  | 'social-improvements' // Better relationships and social interactions
  | 'cognitive-function'; // Memory, focus, decision-making improvements

export type MotivationLevel =
  | 'very-motivated'    // Highly committed to practice
  | 'motivated'         // Generally committed
  | 'somewhat-motivated' // Interested but not fully committed
  | 'low-motivation'    // Struggling with motivation
  | 'variable';         // Motivation varies day to day

export type ConsistencyPreference =
  | 'strict-schedule'   // Same time every day
  | 'flexible-daily'    // Daily but flexible timing
  | 'several-per-week'  // A few times per week
  | 'as-needed'         // When feeling stressed or triggered
  | 'intensive-periods' // Concentrated practice periods
  | 'gradual-building'  // Slowly increasing frequency
  | 'maintenance-mode'; // Minimal but consistent practice