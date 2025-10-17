import { BreathingTechnique } from './workLifeBalance';

// Enhanced sleep and recovery data structure with breathing integration
export interface EnhancedSleepRecovery {
  // Basic sleep schedule (existing)
  bedtime: string;    // '22:00'
  wakeTime: string;   // '07:00'

  // Enhanced sleep quality tracking
  sleepQuality: number; // 1-10 scale
  sleepChallenges: SleepChallenge[];
  windDownRoutine: WindDownActivity[];
  morningEnergy: number; // 1-10 scale

  // Breathing integration for sleep
  interestedInSleepBreathing: boolean;
  currentSleepAids: SleepAid[];
  preferredSleepBreathingTechniques?: BreathingTechnique[];

  // Advanced sleep patterns
  sleepPatterns?: SleepPattern[];
  recoveryFactors?: RecoveryFactor[];
  sleepEnvironment?: SleepEnvironment;

  // Sleep goals and preferences
  sleepGoals?: SleepGoal[];
  timeToFallAsleep?: number; // minutes
  nightTimeWakeups?: number; // per night
  sleepEfficiency?: number;  // percentage

  // Assessment tracking
  lastSleepAssessment?: string; // ISO date
  sleepTrends?: SleepTrend[];
}

// Sleep challenges that can be addressed with breathing
export type SleepChallenge =
  | 'falling-asleep'        // Difficulty initiating sleep
  | 'staying-asleep'        // Frequent night wakings
  | 'racing-thoughts'       // Mental hyperactivity at bedtime
  | 'physical-tension'      // Body tension preventing relaxation
  | 'early-waking'          // Waking too early and can't return to sleep
  | 'restless-sleep'        // Tossing and turning throughout night
  | 'anxiety-bedtime'       // Anxiety specifically around sleep time
  | 'irregular-schedule'    // Inconsistent sleep timing
  | 'light-sensitive'       // Easily awakened by light/sound
  | 'temperature-sensitive' // Sleep disrupted by temperature
  | 'nightmares-stress'     // Stress-related bad dreams
  | 'weekend-oversleep'     // Difficulty maintaining schedule on weekends
  | 'shift-work-sleep'      // Sleep issues due to irregular work hours
  | 'travel-jet-lag'        // Sleep disruption from travel/time changes
  | 'none';                 // No specific challenges

// Wind-down activities (some breathing-related)
export type WindDownActivity =
  | 'reading'              // Reading books or e-readers
  | 'stretching'           // Gentle physical stretches
  | 'breathing-exercises'  // Dedicated breathing practice
  | 'meditation'           // Mindfulness or meditation practice
  | 'warm-bath'            // Relaxing bath or shower
  | 'gentle-music'         // Calming music or sounds
  | 'journaling'           // Writing thoughts or gratitude
  | 'herbal-tea'           // Relaxing beverages
  | 'dim-lighting'         // Reducing light exposure
  | 'no-screens'           // Avoiding electronic devices
  | 'progressive-relaxation' // Body scan or muscle relaxation
  | 'aromatherapy'         // Essential oils or scents
  | 'prayer-spiritual'     // Spiritual or religious practices
  | 'organize-tomorrow'    // Planning next day to reduce anxiety
  | 'none';                // No specific routine

// Current sleep aids being used
export type SleepAid =
  | 'none'                 // No aids currently used
  | 'apps'                 // Sleep apps, white noise, etc.
  | 'music'                // Music or soundscapes
  | 'medication'           // Sleep medications (prescribed or OTC)
  | 'breathing'            // Breathing techniques
  | 'supplements'          // Melatonin, magnesium, etc.
  | 'weighted-blanket'     // Weighted blankets for comfort
  | 'eye-mask'             // Sleep masks for darkness
  | 'earplugs'             // Noise reduction
  | 'temperature-control'  // Cooling/heating devices
  | 'aromatherapy'         // Essential oils, diffusers
  | 'meditation-apps'      // Guided meditation or mindfulness
  | 'cbd-products'         // CBD oils or products
  | 'yoga-stretching'      // Physical relaxation practices
  | 'blackout-curtains'    // Environmental modifications
  | 'comfortable-mattress'; // Sleep surface improvements

// Sleep pattern analysis
export type SleepPattern =
  | 'consistent-schedule'   // Regular bedtime and wake time
  | 'night-owl'            // Naturally later bedtime preference
  | 'early-bird'           // Naturally earlier bedtime preference
  | 'irregular-pattern'    // No consistent sleep schedule
  | 'weekend-shift'        // Different schedule on weekends
  | 'seasonal-changes'     // Sleep patterns change with seasons
  | 'stress-responsive'    // Sleep quality varies with stress levels
  | 'exercise-dependent'   // Sleep quality depends on physical activity
  | 'caffeine-sensitive'   // Sleep affected by caffeine timing
  | 'meal-timing-sensitive' // Sleep affected by meal timing
  | 'social-jet-lag'       // Misalignment between social and biological time
  | 'variable-duration'    // Need different amounts of sleep different days
  | 'recovery-sleeper'     // Needs extra sleep after poor nights
  | 'light-sensitive-circadian'; // Circadian rhythm sensitive to light exposure

// Recovery factors that impact sleep quality
export type RecoveryFactor =
  | 'physical-exercise'    // Regular physical activity
  | 'mental-stress'        // Psychological stress levels
  | 'work-demands'         // Job-related stress and hours
  | 'social-obligations'   // Social schedule impacts
  | 'technology-exposure'  // Screen time before bed
  | 'caffeine-intake'      // Stimulant consumption timing
  | 'alcohol-consumption'  // Alcohol's impact on sleep quality
  | 'meal-timing'          // When and what you eat
  | 'room-environment'     // Temperature, noise, light
  | 'mattress-comfort'     // Physical comfort of sleep surface
  | 'health-conditions'    // Medical issues affecting sleep
  | 'medications'          // Prescription or OTC medications
  | 'seasonal-light'       // Natural light exposure patterns
  | 'weekend-schedule'     // Weekend routine differences
  | 'travel-frequency'     // How often sleep environment changes
  | 'partner-sleep-habits' // Sleep partner's impact on your sleep
  | 'pet-disruptions'      // Animals affecting sleep
  | 'neighborhood-noise'   // External sound disruptions
  | 'work-from-home'       // Home environment affecting sleep boundaries
  | 'shift-work'           // Non-traditional work schedules

// Sleep environment factors
export interface SleepEnvironment {
  roomTemperature: 'too-hot' | 'too-cold' | 'just-right' | 'varies';
  noiseLevel: 'very-quiet' | 'some-noise' | 'noisy' | 'variable';
  lightControl: 'very-dark' | 'some-light' | 'bright' | 'variable';
  bedComfort: 'very-comfortable' | 'comfortable' | 'uncomfortable' | 'varies';
  airQuality: 'excellent' | 'good' | 'poor' | 'varies';

  // Controllable factors
  hasBlackoutCurtains: boolean;
  usesWhiteNoise: boolean;
  hasTemperatureControl: boolean;
  sleepsAlone: boolean;
  petsInBed: boolean;
}

// Sleep-specific goals
export type SleepGoal =
  | 'fall-asleep-faster'    // Reduce time to fall asleep
  | 'sleep-through-night'   // Reduce night wakings
  | 'wake-refreshed'        // Improve morning energy
  | 'consistent-schedule'   // Maintain regular sleep times
  | 'deeper-sleep'          // Improve sleep quality
  | 'natural-waking'        // Wake without alarm
  | 'reduce-sleep-anxiety'  // Less worry about sleep
  | 'improve-dreams'        // Better dream quality/recall
  | 'recover-from-stress'   // Use sleep for stress recovery
  | 'optimize-duration'     // Find ideal sleep length
  | 'pre-performance-sleep' // Sleep well before important events
  | 'travel-sleep-resilience' // Maintain sleep quality while traveling
  | 'reduce-dependencies'   // Depend less on sleep aids
  | 'morning-routine-energy' // Have energy for morning activities
  | 'manage-shift-work'     // Optimize sleep with irregular schedule
  | 'seasonal-adaptation'   // Adapt sleep to seasonal changes
  | 'recover-from-insomnia' // Overcome chronic sleep issues
  | 'family-sleep-harmony'  // Coordinate sleep with family/partner
  | 'age-appropriate-sleep' // Adapt sleep patterns as you age
  | 'holistic-wellness'     // Integrate sleep with overall health goals

// Sleep trend tracking
export interface SleepTrend {
  date: string;
  sleepQuality: number;
  morningEnergy: number;
  timeToFallAsleep: number; // minutes
  nightWakeups: number;
  totalSleepTime: number;   // hours
  breathingSessionUsed?: boolean;
  stressLevelBeforeBed?: number;
  windDownActivities?: WindDownActivity[];
  notesOrFactors?: string;
}

// Sleep-specific breathing sessions
export interface SleepBreathingSession {
  id: string;
  userId: string;
  technique: BreathingTechnique;
  purpose: SleepBreathingPurpose;

  // Timing and context
  startTime: string; // ISO timestamp
  endTime?: string;
  duration: number;  // seconds
  timeRelativeToBedtime: number; // minutes before/after intended bedtime

  // Sleep context
  sleepChallenge?: SleepChallenge;
  stressLevelBefore?: number; // 1-10
  physicalTensionBefore?: number; // 1-10
  mentalActivityBefore?: number; // 1-10 (racing thoughts)

  // Effectiveness tracking
  relaxationAfter?: number; // 1-10 how relaxed after session
  timeToFallAsleepAfter?: number; // minutes to fall asleep after session
  sleepQualityNextMorning?: number; // 1-10
  wouldUseAgain?: boolean;

  // Session details
  guidedOrSelfDirected: 'guided' | 'self-directed';
  backgroundSounds?: boolean;
  environmentNotes?: string;
  completed: boolean;

  createdAt: string;
  updatedAt: string;
}

// Purpose of sleep breathing session
export type SleepBreathingPurpose =
  | 'bedtime-routine'      // Part of regular wind-down
  | 'falling-asleep'       // Having trouble falling asleep
  | 'middle-of-night'      // Woke up and can't get back to sleep
  | 'early-morning'        // Woke too early
  | 'stress-relief'        // High stress preventing sleep
  | 'physical-tension'     // Body tension keeping awake
  | 'racing-thoughts'      // Mental hyperactivity
  | 'anxiety-about-sleep'  // Worried about not sleeping
  | 'preparation'          // Preparing for good sleep
  | 'recovery'             // Recovering from poor sleep
  | 'performance-prep'     // Sleep before important day
  | 'schedule-adjustment'  // Adapting to new sleep schedule
  | 'travel-adaptation'    // Adjusting to new time zone
  | 'experiment'           // Trying new technique
  | 'maintenance'          // Regular practice for sleep health

// Sleep breathing recommendations
export interface SleepBreathingRecommendation {
  id: string;
  technique: BreathingTechnique;
  purpose: SleepBreathingPurpose;
  timing: SleepBreathingTiming;
  duration: number; // minutes

  // Recommendation context
  forSleepChallenge?: SleepChallenge;
  optimalTimeBeforeBed?: number; // minutes

  // Instructions and guidance
  title: string;
  description: string;
  instructions: string[];
  tips: string[];

  // Effectiveness predictors
  effectivenessForFallingAsleep: number; // 1-5 rating
  effectivenessForStayingAsleep: number; // 1-5 rating
  effectivenessForMorningEnergy: number; // 1-5 rating

  // Personalization factors
  bestForStressLevel?: number; // 1-10, null means any
  bestForExperienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  requiresQuietEnvironment?: boolean;
  canBeDonenInBed?: boolean;

  priority: 'low' | 'medium' | 'high' | 'urgent';
  reasoning: string;
}

// When to do sleep breathing
export type SleepBreathingTiming =
  | 'wind-down-routine'    // 30-60 minutes before bed
  | 'in-bed-before-sleep'  // Once lying down, before sleep
  | 'if-cant-fall-asleep'  // If still awake after 20+ minutes
  | 'middle-of-night-wake' // If you wake up during the night
  | 'early-morning-wake'   // If you wake too early
  | 'any-time-stressed'    // Whenever feeling stressed about sleep
  | 'after-caffeine'       // If had caffeine later than usual
  | 'after-stimulation'    // After exciting or stressful day
  | 'schedule-disruption'  // When sleep schedule is off
  | 'travel-adjustment'    // When adapting to new time zone
  | 'nap-preparation'      // Before daytime naps
  | 'morning-routine'      // Upon waking to start day calmly

// Sleep analytics and insights
export interface SleepAnalytics {
  userId: string;
  period: 'week' | 'month' | 'quarter';

  // Sleep quality trends
  averageSleepQuality: number;
  averageMorningEnergy: number;
  averageTimeToFallAsleep: number;
  averageNightWakeups: number;

  // Sleep pattern insights
  mostCommonChallenges: SleepChallenge[];
  mostEffectiveWindDownActivities: WindDownActivity[];
  sleepQualityByDayOfWeek: Record<string, number>;

  // Breathing session effectiveness
  breathingSessionsUsed: number;
  averageBreathingEffectiveness: number;
  mostEffectiveTechniques: Array<{
    technique: BreathingTechnique;
    averageImprovement: number;
    usageCount: number;
  }>;

  // Correlation insights
  stressImpactOnSleep: number; // correlation coefficient
  exerciseImpactOnSleep: number;
  breathingImpactOnSleep: number;

  // Recommendations
  suggestedOptimalBedtime: string;
  suggestedOptimalWakeTime: string;
  recommendedBreathingTechniques: BreathingTechnique[];
  suggestedWindDownAdjustments: string[];

  // Progress indicators
  sleepQualityTrend: 'improving' | 'stable' | 'declining';
  morningEnergyTrend: 'improving' | 'stable' | 'declining';
  consistencyTrend: 'improving' | 'stable' | 'declining';

  generatedAt: string;
}

// Integration with existing wellness goals
export interface SleepWellnessIntegration {
  // Links to main wellness goals
  relatedWellnessGoals: string[]; // references to WellnessGoal

  // Sleep's impact on other goals
  sleepImpactOnStress: number;      // How sleep quality affects stress levels
  sleepImpactOnFocus: number;       // How sleep quality affects focus
  sleepImpactOnEnergy: number;      // How sleep quality affects energy
  sleepImpactOnMood: number;        // How sleep quality affects emotional state

  // Cross-system recommendations
  recommendSleepForStressGoal: boolean;   // Recommend sleep improvements for stress reduction
  recommendSleepForFocusGoal: boolean;    // Recommend sleep improvements for focus
  recommendSleepForEnergyGoal: boolean;   // Recommend sleep improvements for energy

  // Integrated tracking
  trackSleepInWellnessAssessment: boolean;
  includeSleepInDailyCheck: boolean;
  prioritizeSleepBasedOnGoals: boolean;
}

// Circadian rhythm optimization
export interface CircadianOptimization {
  // Light exposure patterns
  morningLightExposure: boolean;
  eveningLightReduction: boolean;
  bluelightFiltering: boolean;

  // Meal timing
  lastMealTime: string; // How many hours before bed
  caffeineCutoffTime: string; // Last caffeine intake time

  // Activity timing
  exerciseTime: 'morning' | 'afternoon' | 'evening' | 'varies';
  exerciseEndTime: string; // How many hours before bed

  // Temperature regulation
  roomTemperaturePreference: number; // degrees
  bodyTemperatureAwareness: boolean; // Aware of core temp changes

  // Consistency factors
  weekendScheduleVariation: number; // hours difference from weekday
  socialJetLagHours: number; // difference between social and biological time

  // Optimization goals
  targetCircadianConsistency: boolean;
  targetOptimalLightExposure: boolean;
  targetTemperatureOptimization: boolean;
}