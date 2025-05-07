
import { useState, useEffect, useRef } from 'react';
import { BreathingPhase } from '../types';
import type { BreathingPattern } from '../data/breathingPatterns';

interface UseBreathingTimerProps {
  isActive: boolean;
  voiceEnabled: boolean;
  pattern: BreathingPattern;
  onPhaseChange: (phase: BreathingPhase) => void;
}

export function useBreathingTimer({ 
  isActive, 
  voiceEnabled, 
  pattern, 
  onPhaseChange 
}: UseBreathingTimerProps) {
  const [breathingPhase, setBreathingPhase] = useState<BreathingPhase>('inhale');
  const [count, setCount] = useState(pattern.inhale);
  const cyclesCompletedRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentPatternRef = useRef(pattern);

  // Reset count when pattern changes
  useEffect(() => {
    if (currentPatternRef.current !== pattern) {
      currentPatternRef.current = pattern;
      setBreathingPhase('inhale');
      setCount(pattern.inhale);
    }
  }, [pattern]);

  // Handle breathing timer
  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount > 1) return prevCount - 1;
        
        // Change phase based on current pattern
        switch (breathingPhase) {
          case 'inhale':
            if (pattern.hold) {
              const newPhase = 'hold';
              setBreathingPhase(newPhase);
              onPhaseChange(newPhase);
              return pattern.hold; // Hold duration
            } else {
              const newPhase = 'exhale';
              setBreathingPhase(newPhase);
              onPhaseChange(newPhase);
              return pattern.exhale; // Exhale duration
            }
          case 'hold':
            const exhalePhase = 'exhale';
            setBreathingPhase(exhalePhase);
            onPhaseChange(exhalePhase);
            return pattern.exhale; // Exhale duration
          case 'exhale':
            if (pattern.rest) {
              const restPhase = 'rest';
              setBreathingPhase(restPhase);
              onPhaseChange(restPhase);
              return pattern.rest; // Rest duration
            } else {
              // If no rest phase, we've completed a cycle
              cyclesCompletedRef.current += 1;
              const inhalePhase = 'inhale';
              setBreathingPhase(inhalePhase);
              onPhaseChange(inhalePhase);
              return pattern.inhale; // Inhale duration
            }  
          case 'rest':
            // Completed a full cycle
            cyclesCompletedRef.current += 1;
            const inhalePhase = 'inhale';
            setBreathingPhase(inhalePhase);
            onPhaseChange(inhalePhase);
            return pattern.inhale; // Inhale duration
          default:
            return pattern.inhale;
        }
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, breathingPhase, pattern, onPhaseChange]);

  const resetTimer = () => {
    setBreathingPhase('inhale');
    setCount(pattern.inhale);
    cyclesCompletedRef.current = 0;
  };

  return {
    breathingPhase,
    count,
    cyclesCompleted: cyclesCompletedRef.current,
    resetTimer
  };
}
