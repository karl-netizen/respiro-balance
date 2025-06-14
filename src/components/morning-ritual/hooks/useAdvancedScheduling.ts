
import { useState, useCallback } from 'react';
import { useUserPreferences } from '@/context';
import { MorningRitual } from '@/context/types';

interface ScheduleConflict {
  type: 'overlap' | 'dependency' | 'weather';
  ritual1: string;
  ritual2?: string;
  suggestion: string;
}

interface ScheduleOptimization {
  conflicts: ScheduleConflict[];
  feasibilityScore: number;
  suggestions: string[];
}

export const useAdvancedScheduling = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [isOptimizing, setIsOptimizing] = useState(false);

  const analyzeSchedule = useCallback((rituals: MorningRitual[]): ScheduleOptimization => {
    const conflicts: ScheduleConflict[] = [];
    
    // Check for time overlaps
    const sortedRituals = [...rituals].sort((a, b) => 
      a.timeOfDay.localeCompare(b.timeOfDay)
    );

    for (let i = 0; i < sortedRituals.length - 1; i++) {
      const current = sortedRituals[i];
      const next = sortedRituals[i + 1];
      
      const currentEnd = new Date(`2000-01-01T${current.timeOfDay}`);
      currentEnd.setMinutes(currentEnd.getMinutes() + current.duration);
      
      const nextStart = new Date(`2000-01-01T${next.timeOfDay}`);
      
      if (currentEnd > nextStart) {
        conflicts.push({
          type: 'overlap',
          ritual1: current.title,
          ritual2: next.title,
          suggestion: `Move ${next.title} to ${currentEnd.toTimeString().slice(0, 5)}`
        });
      }
    }

    const feasibilityScore = Math.max(0, 100 - (conflicts.length * 15));
    
    return {
      conflicts,
      feasibilityScore,
      suggestions: conflicts.map(c => c.suggestion)
    };
  }, []);

  const optimizeSchedule = useCallback(async () => {
    setIsOptimizing(true);
    try {
      const rituals = preferences.morningRituals || [];
      const optimization = analyzeSchedule(rituals);
      
      // Auto-resolve simple conflicts
      const optimizedRituals = [...rituals];
      
      // Simple optimization: spread overlapping rituals
      for (const conflict of optimization.conflicts) {
        if (conflict.type === 'overlap' && conflict.ritual2) {
          const ritual1Index = optimizedRituals.findIndex(r => r.title === conflict.ritual1);
          const ritual2Index = optimizedRituals.findIndex(r => r.title === conflict.ritual2);
          
          if (ritual1Index !== -1 && ritual2Index !== -1) {
            const ritual1 = optimizedRituals[ritual1Index];
            const ritual2 = optimizedRituals[ritual2Index];
            
            const ritual1End = new Date(`2000-01-01T${ritual1.timeOfDay}`);
            ritual1End.setMinutes(ritual1End.getMinutes() + ritual1.duration + 5); // 5 min buffer
            
            optimizedRituals[ritual2Index] = {
              ...ritual2,
              timeOfDay: ritual1End.toTimeString().slice(0, 5)
            };
          }
        }
      }
      
      await updatePreferences({ morningRituals: optimizedRituals });
    } finally {
      setIsOptimizing(false);
    }
  }, [preferences.morningRituals, analyzeSchedule, updatePreferences]);

  return {
    analyzeSchedule,
    optimizeSchedule,
    isOptimizing
  };
};
