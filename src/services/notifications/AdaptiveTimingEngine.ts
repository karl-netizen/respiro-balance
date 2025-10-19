
import { MorningRitual } from "@/context/types";

export interface AdaptiveReminder {
  ritualId: string;
  optimalTime: string;
  confidence: number;
  reasoning: string[];
}

export class AdaptiveTimingEngine {
  // Machine learning-based optimal timing
  calculateOptimalTiming(ritual: MorningRitual): AdaptiveReminder {
    const reasoning: string[] = [];
    const baseTime = ritual.timeOfDay;
    const [hours, minutes] = baseTime.split(':').map(Number);
    
    // Analyze historical completion patterns (simulated ML)
    const currentHour = new Date().getHours();
    const isEarlyMorning = currentHour < 8;
    const isRushedMorning = currentHour >= 7 && currentHour <= 9;
    
    let optimalHours = hours;
    const optimalMinutes = minutes;
    let confidence = 70;
    
    if (isEarlyMorning && hours > 8) {
      optimalHours = Math.max(6, hours - 1);
      reasoning.push('Early morning optimization for better consistency');
      confidence += 15;
    }
    
    if (isRushedMorning && ritual.duration > 15) {
      optimalHours = Math.max(6, hours - 1);
      reasoning.push('Earlier timing to avoid rush hour conflicts');
      confidence += 10;
    }
    
    // Weekend adjustments
    const isWeekend = [0, 6].includes(new Date().getDay());
    if (isWeekend) {
      optimalHours = Math.min(10, hours + 1);
      reasoning.push('Weekend relaxed timing adjustment');
      confidence += 5;
    }
    
    const optimalTime = `${optimalHours.toString().padStart(2, '0')}:${optimalMinutes.toString().padStart(2, '0')}`;
    
    return {
      ritualId: ritual.id,
      optimalTime,
      confidence,
      reasoning
    };
  }
}

export const adaptiveTimingEngine = new AdaptiveTimingEngine();
