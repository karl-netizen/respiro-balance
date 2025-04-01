import { Dispatch, SetStateAction } from 'react';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  focusMode: boolean;
  defaultMeditationDuration: number;
  preferredBreathingTechnique: string;
  showBreathingGuide: boolean;
  breathingSpeed: 'slow' | 'medium' | 'fast';
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  backgroundMusic: 'nature' | 'ambient' | 'none';
  focusTimerDuration: number;
  breakTimerDuration: number;
  weeklyMeditationGoal: number;
  autoPlayNextSession: boolean;
  hasWearableDevice: boolean;
  wearableDeviceType: string;
  wearableDeviceId: string;
  lastSyncDate: string;
  connectedDevices: BluetoothDevice[];
  metricsOfInterest: string[];
  focusChallenges: string[];
  workDays: number[];
  userRole: 'user' | 'coach' | 'admin';
  meditationGoals: string[];
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  isCoach: () => boolean;
  connectBluetoothDevice: () => Promise<boolean>;
  disconnectBluetoothDevice: (deviceId: string) => void;
}
