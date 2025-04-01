
/**
 * Utility functions for ritual management
 */
import { MorningRitual, RitualStatus } from "@/context/types";
import { shouldDoRitualToday, shouldDoRitualYesterday, wasCompletedOnDate, wasCompletedToday } from "./dateUtils";

/**
 * Generate a unique ID for a new ritual
 * @returns Unique ID string
 */
export const generateRitualId = (): string => {
  return 'ritual_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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
