/**
 * Utility functions for the Morning Ritual Builder
 */

import { MorningRitual, RitualStatus, WorkDay } from "@/context/types";

/**
 * Format time from 24-hour format to 12-hour AM/PM format
 * @param time Time in HH:MM format
 * @returns Formatted time (e.g., "7:30 AM")
 */
export const formatTimeDisplay = (time: string): string => {
  if (!time || !time.includes(':')) return time;
  
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Generate a unique ID for a new ritual
 * @returns Unique ID string
 */
export const generateRitualId = (): string => {
  return 'ritual_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

/**
 * Calculate the time difference in minutes between two time strings
 * @param startTime Start time in HH:MM format
 * @param endTime End time in HH:MM format
 * @returns Time difference in minutes
 */
export const getTimeDifferenceInMinutes = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 0;
  
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  
  // Handle crossing midnight
  return endTotalMinutes >= startTotalMinutes 
    ? endTotalMinutes - startTotalMinutes
    : (24 * 60) - startTotalMinutes + endTotalMinutes;
};

/**
 * Generate a suggested ritual based on user preferences
 * @param wakeTime User's wake time
 * @param morningEnergyLevel User's morning energy level
 * @param existingActivities Current morning activities
 * @returns Array of activity suggestions
 */
export const getSuggestedActivities = (
  wakeTime: string = "07:00",
  morningEnergyLevel: number = 5,
  existingActivities: string[] = []
): string[] => {
  // Base suggestions everyone should consider
  const baseSuggestions = ["hydration", "meditation"];
  
  // Energy-based suggestions
  const energyBasedSuggestions = morningEnergyLevel <= 3
    ? ["journaling", "stretching"] // Low energy
    : morningEnergyLevel >= 8
      ? ["exercise", "cold_shower"] // High energy
      : ["stretching", "planning"]; // Medium energy
  
  // Filter out activities the user is already doing
  return [...baseSuggestions, ...energyBasedSuggestions]
    .filter(activity => !existingActivities.includes(activity));
};

/**
 * Check if a ritual should be done today based on its recurrence pattern
 * @param recurrence Ritual recurrence pattern
 * @param daysOfWeek Optional specific days for custom recurrence
 * @returns Boolean indicating if ritual should be done today
 */
export const shouldDoRitualToday = (
  recurrence: string,
  daysOfWeek?: string[]
): boolean => {
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const isWeekend = dayOfWeek === 'saturday' || dayOfWeek === 'sunday';
  
  switch (recurrence) {
    case 'daily':
      return true;
    case 'weekdays':
      return !isWeekend;
    case 'weekends':
      return isWeekend;
    case 'custom':
      return daysOfWeek ? daysOfWeek.includes(dayOfWeek) : false;
    default:
      return false;
  }
};

/**
 * Check if a ritual was completed today
 * @param ritual The ritual to check
 * @returns Boolean indicating if ritual was completed today
 */
export const wasCompletedToday = (lastCompleted?: string): boolean => {
  if (!lastCompleted) {
    return false;
  }
  
  const today = new Date();
  const lastCompletedDate = new Date(lastCompleted);
  
  return (
    today.getDate() === lastCompletedDate.getDate() &&
    today.getMonth() === lastCompletedDate.getMonth() &&
    today.getFullYear() === lastCompletedDate.getFullYear()
  );
};

/**
 * Get the appropriate time for a ritual based on user preferences
 * @param preferences User preferences object
 * @param isWeekend Whether the ritual is for a weekend
 * @returns Appropriate time string in HH:MM format
 */
export const getRitualTimeFromPreferences = (
  preferences: { weekdayWakeTime?: string; weekendWakeTime?: string },
  isWeekend: boolean = false
): string => {
  const defaultWeekdayTime = "07:00";
  const defaultWeekendTime = "08:00";
  
  if (isWeekend) {
    return preferences.weekendWakeTime || defaultWeekendTime;
  }
  
  return preferences.weekdayWakeTime || defaultWeekdayTime;
};

/**
 * Updates ritual statuses based on current date and completion
 * @param rituals Array of morning rituals
 * @returns Updated array of rituals with correct statuses
 */
export const updateRitualStatuses = (rituals: MorningRitual[]): MorningRitual[] => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  return rituals.map(ritual => {
    // Skip if already completed today
    if (ritual.status === 'completed' && wasCompletedToday(ritual.lastCompleted)) {
      return ritual;
    }
    
    // Check if should be done today
    const isScheduledToday = shouldDoRitualToday(ritual.recurrence, ritual.daysOfWeek);
    
    // If not scheduled for today, leave as is
    if (!isScheduledToday) {
      return ritual;
    }
    
    // If it was scheduled yesterday but not completed, mark as missed and reset streak
    const wasScheduledYesterday = shouldDoRitualYesterday(ritual.recurrence, ritual.daysOfWeek);
    const wasCompletedYesterday = ritual.lastCompleted && wasCompletedOnDate(ritual.lastCompleted, yesterday);
    
    if (wasScheduledYesterday && !wasCompletedYesterday && ritual.status !== 'missed') {
      return {
        ...ritual,
        status: 'missed' as RitualStatus,
        streak: 0
      };
    }
    
    // If scheduled for today and not yet marked, set as planned
    if (ritual.status !== 'planned' && ritual.status !== 'in_progress') {
      return {
        ...ritual,
        status: 'planned' as RitualStatus
      };
    }
    
    return ritual;
  });
};

/**
 * Check if a ritual was scheduled for yesterday
 */
const shouldDoRitualYesterday = (
  recurrence: string,
  daysOfWeek?: string[]
): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const yesterdayName = yesterday.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const isYesterdayWeekend = yesterdayName === 'saturday' || yesterdayName === 'sunday';
  
  switch (recurrence) {
    case 'daily':
      return true;
    case 'weekdays':
      return !isYesterdayWeekend;
    case 'weekends':
      return isYesterdayWeekend;
    case 'custom':
      return daysOfWeek ? daysOfWeek.includes(yesterdayName) : false;
    default:
      return false;
  }
};

/**
 * Check if ritual was completed on a specific date
 */
const wasCompletedOnDate = (lastCompleted: string, date: Date): boolean => {
  const completedDate = new Date(lastCompleted);
  
  return (
    completedDate.getDate() === date.getDate() &&
    completedDate.getMonth() === date.getMonth() &&
    completedDate.getFullYear() === date.getFullYear()
  );
};

/**
 * Calculate biometric change during a meditation session
 * @param before Initial biometric data
 * @param after Final biometric data
 * @returns Object with percentage changes
 */
export const calculateBiometricChange = (
  before: { 
    heart_rate?: number;
    hrv?: number;
    respiratory_rate?: number;
    stress_score?: number;
  } | undefined,
  after: {
    heart_rate?: number;
    hrv?: number;
    respiratory_rate?: number;
    stress_score?: number;
  } | undefined
): {
  heart_rate: number;
  hrv: number;
  respiratory_rate: number;
  stress_score: number;
} => {
  // If no data, return zeros
  if (!before || !after) {
    return {
      heart_rate: 0,
      hrv: 0,
      respiratory_rate: 0,
      stress_score: 0
    };
  }

  // Calculate percentage changes
  const getPercentChange = (start?: number, end?: number): number => {
    if (start === undefined || end === undefined || start === 0) return 0;
    return Math.round(((end - start) / start) * 100);
  };

  return {
    heart_rate: getPercentChange(before.heart_rate, after.heart_rate),
    hrv: getPercentChange(before.hrv, after.hrv),
    respiratory_rate: getPercentChange(before.respiratory_rate, after.respiratory_rate),
    stress_score: getPercentChange(before.stress_score, after.stress_score)
  };
};

/**
 * Extract biometric data from devices for session start
 * @param connectedDevices Array of connected devices
 * @returns Simulated biometric data
 */
export const getBiometricDataFromDevices = (
  connectedDevices: Array<{id: string; name: string; type: string}> = []
): {
  heart_rate: number;
  hrv: number;
  respiratory_rate: number;
  stress_score: number;
} => {
  // If no devices connected, return default values
  if (!connectedDevices.length) {
    return {
      heart_rate: 75,
      hrv: 55,
      respiratory_rate: 16,
      stress_score: 65
    };
  }

  // Simulate different readings based on device types
  const hasHeartRateMonitor = connectedDevices.some(device => 
    device.type === 'heart_rate' || device.name.toLowerCase().includes('hr')
  );

  return {
    heart_rate: hasHeartRateMonitor ? Math.floor(70 + Math.random() * 15) : 75,
    hrv: hasHeartRateMonitor ? Math.floor(45 + Math.random() * 20) : 55,
    respiratory_rate: Math.floor(14 + Math.random() * 4),
    stress_score: Math.floor(60 + Math.random() * 20)
  };
};
