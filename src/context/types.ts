
export interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  types: {
    reminders: boolean;
    achievements: boolean;
    social: boolean;
    marketing: boolean;
  };
}

export interface MeditationSettings {
  defaultDuration: number;
  preferredTechniques: string[];
  backgroundSounds: boolean;
  guidedVoice: 'male' | 'female';
  sessionReminders: boolean;
}

export interface UserPreferences {
  // Core settings
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  subscriptionTier: 'free' | 'premium' | 'premium-plus' | 'premium-pro' | 'coach' | 'enterprise';
  
  // Notification settings
  notifications: NotificationSettings;
  
  // Meditation settings
  meditation: MeditationSettings;
  
  // Privacy settings
  privacy: {
    shareProgress: boolean;
    publicProfile: boolean;
    dataCollection: boolean;
  };
  
  // Accessibility settings
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    screenReader: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  
  // Display settings
  display: {
    compactMode: boolean;
    showAchievements: boolean;
    showStreak: boolean;
    showProgress: boolean;
  };
  
  // Integration settings
  integrations: {
    healthKit: boolean;
    googleFit: boolean;
    fitbit: boolean;
    spotify: boolean;
  };
}
