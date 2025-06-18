
export interface TooltipConfig {
  id: string;
  target: string;
  content: string | React.ReactNode;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  trigger: 'hover' | 'click' | 'focus' | 'manual';
  delay?: number;
  interactive?: boolean;
  showOnce?: boolean;
  condition?: () => boolean;
  onShow?: () => void;
  onHide?: () => void;
}

export interface TourStep {
  id: string;
  target: string;
  title: string;
  content: string | React.ReactNode;
  placement: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'scroll' | 'wait' | 'custom';
  nextTrigger?: 'auto' | 'manual' | 'interaction';
  skippable?: boolean;
  highlight?: boolean;
  customComponent?: React.ComponentType;
}

export interface TourSequence {
  id: string;
  name: string;
  description: string;
  steps: TourStep[];
  trigger: 'first-visit' | 'manual' | 'feature-unlock' | 'time-based';
  userType?: 'new' | 'returning' | 'premium' | 'all';
  completionReward?: {
    type: 'badge' | 'content' | 'feature';
    value: string;
  };
}

export interface UserGuideState {
  completedTours: string[];
  viewedTooltips: string[];
  currentTourStep?: string;
  userPreferences: {
    enableTooltips: boolean;
    tourSpeed: 'slow' | 'medium' | 'fast';
    preferredTrigger: 'auto' | 'manual';
  };
  lastActivity: Date;
}

export interface UserProfileAnalysis {
  experienceLevel: 'complete-beginner' | 'some-experience' | 'experienced';
  usagePattern: 'morning-routine' | 'work-breaks' | 'evening-wind-down' | 'sporadic';
  deviceUsage: 'mobile-primary' | 'desktop-primary' | 'mixed';
  featureInterest: ('meditation' | 'breathing' | 'focus-mode' | 'progress-tracking')[];
  timeConstraints: 'very-busy' | 'moderate-time' | 'flexible-schedule';
}
