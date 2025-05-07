
import { BreakType, BreakReminder } from "./types";

// Default reminder configurations
export const defaultBreakReminders: Record<BreakType, BreakReminder> = {
  micro: {
    type: 'micro',
    interval: 60, // Every hour
    title: 'Time for a micro-break',
    message: 'Take 5 minutes to rest your eyes and stretch',
    enabled: true
  },
  medium: {
    type: 'medium',
    interval: 120, // Every 2 hours
    title: 'Time for a medium break',
    message: 'Take 15 minutes to walk and refresh your mind',
    enabled: true
  },
  lunch: {
    type: 'lunch',
    interval: 0, // Special case, handled by time of day
    title: 'Lunch break reminder',
    message: 'Time to take your lunch break',
    enabled: true
  },
  long: {
    type: 'long',
    interval: 240, // Every 4 hours
    title: 'Time for a longer break',
    message: 'Take 30 minutes to properly disconnect',
    enabled: true
  }
};
