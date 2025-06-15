
import { MorningRitual } from "@/context/types";
import { RitualFilters } from "./RitualFilter";

// Function to get all available tags from rituals
export const getAllAvailableTags = (rituals: MorningRitual[]): string[] => {
  const tagSet = new Set<string>();
  
  rituals.forEach(ritual => {
    if (ritual.tags && ritual.tags.length > 0) {
      ritual.tags.forEach(tag => tagSet.add(tag));
    }
  });
  
  return Array.from(tagSet).sort();
};

// Function to filter rituals based on the selected filters
export const filterRituals = (rituals: MorningRitual[], filters: RitualFilters): MorningRitual[] => {
  return rituals.filter(ritual => {
    // Filter by status
    if (filters.status !== "all" && ritual.status !== filters.status) {
      return false;
    }
    
    // Filter by priority
    if (filters.priority !== "all" && ritual.priority !== filters.priority) {
      return false;
    }
    
    // Filter by time range
    if (filters.timeRange && typeof filters.timeRange === 'object') {
      const ritualTime = ritual.timeOfDay;
      const ritualTimeMinutes = convertTimeToMinutes(ritualTime);
      const startTimeMinutes = convertTimeToMinutes(filters.timeRange.start);
      const endTimeMinutes = convertTimeToMinutes(filters.timeRange.end);
      
      if (ritualTimeMinutes < startTimeMinutes || ritualTimeMinutes > endTimeMinutes) {
        return false;
      }
    }
    
    // Filter by tags
    if (filters.tags.length > 0) {
      // Check if ritual has at least one of the selected tags
      const hasMatchingTag = ritual.tags.some(tag => filters.tags.includes(tag));
      if (!hasMatchingTag) {
        return false;
      }
    }
    
    return true;
  });
};

// Helper function to convert time string (HH:MM) to minutes for comparison
export const convertTimeToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

// Default filter values
export const defaultFilters: RitualFilters = {
  status: "all",
  priority: "all",
  timeRange: "all",
  tags: []
};
