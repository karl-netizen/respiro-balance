
import { useState, useEffect } from 'react';

interface FocusMetrics {
  currentFocusScore: number;
  focusScoreTrend: number;
  weeklyProgress: number;
  weeklyGoal: number;
  peakHours: string;
  completionRate: number;
  avgDistractions: number;
}

export const useFocusMetrics = () => {
  const [metrics] = useState<FocusMetrics>({
    currentFocusScore: 85,
    focusScoreTrend: 5,
    weeklyProgress: 12,
    weeklyGoal: 15,
    peakHours: "9-11 AM",
    completionRate: 78,
    avgDistractions: 2
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading metrics
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { metrics, isLoading };
};
