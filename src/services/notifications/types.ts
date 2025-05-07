
import { UserPreferences } from "@/context/types";

export type BreakType = 'micro' | 'medium' | 'lunch' | 'long';

export interface BreakReminder {
  type: BreakType;
  interval: number; // in minutes
  title: string;
  message: string;
  enabled: boolean;
}

export interface NotificationPermissionState {
  granted: boolean;
  requested: boolean;
  denied: boolean;
}
