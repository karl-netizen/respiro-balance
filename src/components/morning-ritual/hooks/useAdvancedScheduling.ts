
import { useState, useCallback } from 'react';
import { MorningRitual } from '@/context/types';

export interface Dependency {
  id: string;
  ritualId: string;
  dependsOnId: string;
  type: 'required' | 'optional';
}

export interface WeatherAlternative {
  id: string;
  ritualId: string;
  condition: string;
  alternativeAction: string;
}

export interface ScheduleOptimization {
  totalDuration: number;
  conflicts: string[];
  suggestions: string[];
  efficiency: number;
}

export const useAdvancedScheduling = () => {
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [weatherAlternatives, setWeatherAlternatives] = useState<WeatherAlternative[]>([]);
  const [scheduleOptimization, setScheduleOptimization] = useState<ScheduleOptimization>({
    totalDuration: 0,
    conflicts: [],
    suggestions: [],
    efficiency: 0
  });
  const [isOptimizing, setIsOptimizing] = useState(false);

  const addDependency = useCallback((dependency: Omit<Dependency, 'id'>) => {
    const newDependency = { ...dependency, id: crypto.randomUUID() };
    setDependencies(prev => [...prev, newDependency]);
  }, []);

  const removeDependency = useCallback((id: string) => {
    setDependencies(prev => prev.filter(d => d.id !== id));
  }, []);

  const addWeatherAlternative = useCallback((alternative: Omit<WeatherAlternative, 'id'>) => {
    const newAlternative = { ...alternative, id: crypto.randomUUID() };
    setWeatherAlternatives(prev => [...prev, newAlternative]);
  }, []);

  const removeWeatherAlternative = useCallback((id: string) => {
    setWeatherAlternatives(prev => prev.filter(a => a.id !== id));
  }, []);

  const updateWeatherAlternative = useCallback((id: string, updates: Partial<WeatherAlternative>) => {
    setWeatherAlternatives(prev => 
      prev.map(alt => alt.id === id ? { ...alt, ...updates } : alt)
    );
  }, []);

  const analyzeSchedule = useCallback((rituals: MorningRitual[] = []) => {
    const totalDuration = rituals.reduce((sum, ritual) => sum + ritual.duration, 0);
    const conflicts: string[] = [];
    const suggestions: string[] = [];

    // Analyze for conflicts
    rituals.forEach((ritual, index) => {
      const timeSlot = new Date(`2000-01-01T${ritual.timeOfDay}`);
      rituals.slice(index + 1).forEach(otherRitual => {
        const otherTimeSlot = new Date(`2000-01-01T${otherRitual.timeOfDay}`);
        const timeDiff = Math.abs(timeSlot.getTime() - otherTimeSlot.getTime()) / (1000 * 60);
        
        if (timeDiff < Math.max(ritual.duration, otherRitual.duration)) {
          conflicts.push(`${ritual.title} conflicts with ${otherRitual.title}`);
        }
      });
    });

    // Generate suggestions
    if (totalDuration > 120) {
      suggestions.push('Consider breaking rituals into shorter sessions');
    }
    if (conflicts.length > 0) {
      suggestions.push('Adjust timing to avoid conflicts');
    }

    const efficiency = Math.max(0, 100 - (conflicts.length * 20) - Math.max(0, (totalDuration - 60) / 2));

    setScheduleOptimization({
      totalDuration,
      conflicts,
      suggestions,
      efficiency
    });

    return { totalDuration, conflicts, suggestions, efficiency };
  }, []);

  const optimizeSchedule = useCallback(async () => {
    setIsOptimizing(true);
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsOptimizing(false);
  }, []);

  return {
    dependencies,
    weatherAlternatives,
    scheduleOptimization,
    isOptimizing,
    addDependency,
    removeDependency,
    addWeatherAlternative,
    removeWeatherAlternative,
    updateWeatherAlternative,
    analyzeSchedule,
    optimizeSchedule
  };
};
