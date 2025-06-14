
import { useState, useCallback, useEffect } from 'react';
import { MorningRitual } from '@/context/types';
import { useUserPreferences } from '@/context';

interface RitualDependency {
  id: string;
  parentId: string;
  childId: string;
  type: 'sequential' | 'conditional' | 'trigger';
  delay?: number;
}

interface WeatherAlternative {
  id: string;
  ritualId: string;
  condition: 'rainy' | 'cold' | 'hot' | 'windy' | 'snowy';
  alternativeTitle: string;
  alternativeDuration: number;
  alternativeLocation: 'indoor' | 'covered' | 'different';
  description: string;
}

interface ScheduleOptimization {
  conflicts: Array<{
    ritual1: string;
    ritual2: string;
    type: 'overlap' | 'tight' | 'unrealistic';
    suggestion: string;
  }>;
  suggestions: string[];
  feasibilityScore: number;
  totalMorningTime: number;
  bufferTime: number;
}

export const useAdvancedScheduling = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [dependencies, setDependencies] = useState<RitualDependency[]>([]);
  const [weatherAlternatives, setWeatherAlternatives] = useState<WeatherAlternative[]>([]);
  const [scheduleOptimization, setScheduleOptimization] = useState<ScheduleOptimization | null>(null);

  const rituals = preferences.morningRituals || [];

  // Load dependencies and alternatives from preferences
  useEffect(() => {
    if (preferences.ritualDependencies) {
      setDependencies(preferences.ritualDependencies);
    }
    if (preferences.weatherAlternatives) {
      setWeatherAlternatives(preferences.weatherAlternatives);
    }
  }, [preferences]);

  // Save dependencies to preferences
  const saveDependenciesToPreferences = useCallback((deps: RitualDependency[]) => {
    updatePreferences({
      ritualDependencies: deps
    });
  }, [updatePreferences]);

  // Save weather alternatives to preferences
  const saveAlternativesToPreferences = useCallback((alts: WeatherAlternative[]) => {
    updatePreferences({
      weatherAlternatives: alts
    });
  }, [updatePreferences]);

  // Dependency management
  const addDependency = useCallback((dependency: RitualDependency) => {
    const newDependencies = [...dependencies, dependency];
    setDependencies(newDependencies);
    saveDependenciesToPreferences(newDependencies);
  }, [dependencies, saveDependenciesToPreferences]);

  const removeDependency = useCallback((dependencyId: string) => {
    const newDependencies = dependencies.filter(d => d.id !== dependencyId);
    setDependencies(newDependencies);
    saveDependenciesToPreferences(newDependencies);
  }, [dependencies, saveDependenciesToPreferences]);

  // Weather alternatives management
  const addWeatherAlternative = useCallback((alternative: WeatherAlternative) => {
    const newAlternatives = [...weatherAlternatives, alternative];
    setWeatherAlternatives(newAlternatives);
    saveAlternativesToPreferences(newAlternatives);
  }, [weatherAlternatives, saveAlternativesToPreferences]);

  const removeWeatherAlternative = useCallback((alternativeId: string) => {
    const newAlternatives = weatherAlternatives.filter(a => a.id !== alternativeId);
    setWeatherAlternatives(newAlternatives);
    saveAlternativesToPreferences(newAlternatives);
  }, [weatherAlternatives, saveAlternativesToPreferences]);

  const updateWeatherAlternative = useCallback((alternative: WeatherAlternative) => {
    const newAlternatives = weatherAlternatives.map(a => 
      a.id === alternative.id ? alternative : a
    );
    setWeatherAlternatives(newAlternatives);
    saveAlternativesToPreferences(newAlternatives);
  }, [weatherAlternatives, saveAlternativesToPreferences]);

  // Schedule optimization
  const analyzeSchedule = useCallback(() => {
    const conflicts: ScheduleOptimization['conflicts'] = [];
    const suggestions: string[] = [];
    let feasibilityScore = 100;

    // Convert times to minutes for easier comparison
    const timeToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    // Check for time conflicts
    for (let i = 0; i < rituals.length; i++) {
      for (let j = i + 1; j < rituals.length; j++) {
        const ritual1 = rituals[i];
        const ritual2 = rituals[j];
        
        const start1 = timeToMinutes(ritual1.timeOfDay);
        const end1 = start1 + ritual1.duration;
        const start2 = timeToMinutes(ritual2.timeOfDay);
        const end2 = start2 + ritual2.duration;

        // Check for overlaps
        if (
          (start1 >= start2 && start1 < end2) ||
          (end1 > start2 && end1 <= end2) ||
          (start1 <= start2 && end1 >= end2)
        ) {
          conflicts.push({
            ritual1: ritual1.title,
            ritual2: ritual2.title,
            type: 'overlap',
            suggestion: 'Adjust timing to avoid conflict'
          });
          feasibilityScore -= 30;
        }
        // Check for tight scheduling (less than 5 minutes between)
        else if (Math.abs(end1 - start2) < 5 || Math.abs(end2 - start1) < 5) {
          conflicts.push({
            ritual1: ritual1.title,
            ritual2: ritual2.title,
            type: 'tight',
            suggestion: 'Add 5+ minute buffer between rituals'
          });
          feasibilityScore -= 15;
        }
      }
    }

    // Check for unrealistic durations
    rituals.forEach(ritual => {
      if (ritual.duration > 45) {
        conflicts.push({
          ritual1: ritual.title,
          ritual2: '',
          type: 'unrealistic',
          suggestion: 'Consider breaking into smaller segments'
        });
        feasibilityScore -= 20;
      }
    });

    // Calculate total morning time
    const earliestStart = Math.min(...rituals.map(r => timeToMinutes(r.timeOfDay)));
    const latestEnd = Math.max(...rituals.map(r => timeToMinutes(r.timeOfDay) + r.duration));
    const totalMorningTime = latestEnd - earliestStart;
    const totalRitualTime = rituals.reduce((sum, r) => sum + r.duration, 0);
    const bufferTime = totalMorningTime - totalRitualTime;

    // Generate suggestions
    if (conflicts.length === 0) {
      suggestions.push('Schedule looks great! No conflicts detected.');
    }
    
    if (bufferTime < 10) {
      suggestions.push('Consider adding more buffer time between rituals');
      feasibilityScore -= 10;
    }
    
    if (totalMorningTime > 180) { // More than 3 hours
      suggestions.push('Morning routine might be too long - consider prioritizing');
      feasibilityScore -= 15;
    }
    
    if (rituals.length > 6) {
      suggestions.push('Many rituals can be overwhelming - start with 3-4 core ones');
      feasibilityScore -= 10;
    }

    const optimization: ScheduleOptimization = {
      conflicts,
      suggestions,
      feasibilityScore: Math.max(0, feasibilityScore),
      totalMorningTime,
      bufferTime
    };

    setScheduleOptimization(optimization);
    return optimization;
  }, [rituals]);

  // Get ordered rituals with dependencies
  const getOrderedRituals = useCallback((): MorningRitual[] => {
    const orderedRituals: MorningRitual[] = [];
    const processed = new Set<string>();
    
    const processRitual = (ritualId: string) => {
      if (processed.has(ritualId)) return;
      
      // First process all dependencies
      const deps = dependencies.filter(d => d.childId === ritualId);
      deps.forEach(dep => processRitual(dep.parentId));
      
      // Then add this ritual
      const ritual = rituals.find(r => r.id === ritualId);
      if (ritual) {
        orderedRituals.push(ritual);
        processed.add(ritualId);
      }
    };

    // Process all rituals
    rituals.forEach(ritual => processRitual(ritual.id));
    
    return orderedRituals;
  }, [rituals, dependencies]);

  // Get weather alternatives for a ritual
  const getAlternativesForRitual = useCallback((ritualId: string) => {
    return weatherAlternatives.filter(alt => alt.ritualId === ritualId);
  }, [weatherAlternatives]);

  // Auto-optimize schedule
  const optimizeSchedule = useCallback(() => {
    const optimizedRituals = [...rituals];
    
    // Sort by time
    optimizedRituals.sort((a, b) => {
      const timeA = a.timeOfDay.split(':').map(Number);
      const timeB = b.timeOfDay.split(':').map(Number);
      return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
    });

    // Add buffer time between rituals
    for (let i = 1; i < optimizedRituals.length; i++) {
      const prevRitual = optimizedRituals[i - 1];
      const currentRitual = optimizedRituals[i];
      
      const prevEndTime = timeToMinutes(prevRitual.timeOfDay) + prevRitual.duration;
      const currentStartTime = timeToMinutes(currentRitual.timeOfDay);
      
      if (currentStartTime - prevEndTime < 5) {
        // Add 5-minute buffer
        const newStartTime = prevEndTime + 5;
        const hours = Math.floor(newStartTime / 60);
        const minutes = newStartTime % 60;
        optimizedRituals[i] = {
          ...currentRitual,
          timeOfDay: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
        };
      }
    }

    updatePreferences({ morningRituals: optimizedRituals });
    return optimizedRituals;
  }, [rituals, updatePreferences]);

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  return {
    dependencies,
    weatherAlternatives,
    scheduleOptimization,
    addDependency,
    removeDependency,
    addWeatherAlternative,
    removeWeatherAlternative,
    updateWeatherAlternative,
    analyzeSchedule,
    getOrderedRituals,
    getAlternativesForRitual,
    optimizeSchedule
  };
};
