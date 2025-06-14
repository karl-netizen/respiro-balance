import { UserPreferences } from './types';

const defaultPreferences: UserPreferences = {
  // User role and identification
  userRole: 'user',
  theme: 'system',
  
  // Work schedule
  workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  workStartTime: '09:00',
  workEndTime: '17:00',
  workEnvironment: 'office',
  
  // Focus and productivity
  stressLevel: 3,
  focusChallenges: [],
  energyPattern: 'morning',
  
  // Daily routine
  lunchBreak: true,
  lunchTime: '12:00',
  morningExercise: false,
  exerciseTime: '07:00',
  bedTime: '22:00',
  
  // Meditation preferences
  meditationExperience: 'beginner',
  meditationGoals: [],
  preferredSessionDuration: 15,
  defaultMeditationDuration: 10,
  
  // App usage tracking
  lastActive: new Date().toISOString(),
  dailyUsageMinutes: 0,
  weeklyUsageMinutes: 0,
  
  // Features usage
  hasExportedData: false,
  hasSharedProgress: false,
  hasCompletedOnboarding: false,
  lastOnboardingCompleted: null,
  lastOnboardingSkipped: null,
  lastOnboardingStep: null,
  hasViewedTutorial: false,
  
  // Biometric tracking
  metricsOfInterest: [],
  connectedDevices: [],
  hasWearableDevice: false,
  wearableDeviceType: '',
  wearableDeviceId: '',
  lastSyncDate: '',
  
  // Morning ritual
  morningActivities: [],
  
  // UI preferences
  darkMode: false,
  reducedMotion: false,
  highContrast: false,
  
  // Time management
  timeChallenges: [],
  
  // Personalization algorithm results
  recommendedSessionDuration: 15,
  recommendedMeditationTime: 10,
  recommendedTechniques: ['breathing'],
  
  // Subscription
  subscriptionTier: 'free',
};

export default defaultPreferences;
