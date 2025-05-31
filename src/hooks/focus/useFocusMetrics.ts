
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { FocusScoreCalculator } from '@/components/focus-mode/analytics/FocusScoreCalculator';
import { FocusSession } from '@/components/focus-mode/types';

interface ProductivityMetrics {
  currentFocusScore: number;
  focusScoreTrend: number;
  peakHours: string;
  completionRate: number;
  avgDistractions: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

interface ProductivityInsight {
  type: 'positive' | 'warning' | 'suggestion';
  title: string;
  description: string;
}

export const useFocusMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<ProductivityMetrics>({
    currentFocusScore: 0,
    focusScoreTrend: 0,
    peakHours: '9:00 AM - 11:00 AM',
    completionRate: 0,
    avgDistractions: 0,
    weeklyGoal: 10,
    weeklyProgress: 0
  });
  const [insights, setInsights] = useState<ProductivityInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMetrics();
    }
  }, [user]);

  const fetchMetrics = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Get last 2 weeks of sessions for comparison
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      const { data: sessions, error } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_time', twoWeeksAgo.toISOString())
        .order('start_time', { ascending: false });

      if (error) throw error;

      if (sessions && sessions.length > 0) {
        const thisWeekSessions = sessions.filter(session => {
          const sessionDate = new Date(session.start_time);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return sessionDate >= weekAgo;
        });

        const lastWeekSessions = sessions.filter(session => {
          const sessionDate = new Date(session.start_time);
          const twoWeeksAgo = new Date();
          twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return sessionDate >= twoWeeksAgo && sessionDate < weekAgo;
        });

        // Calculate metrics
        const currentScore = FocusScoreCalculator.calculateWeeklyScore(thisWeekSessions);
        const previousScore = FocusScoreCalculator.calculateWeeklyScore(lastWeekSessions);
        const trend = currentScore - previousScore;

        // Calculate peak hours
        const peakHours = calculatePeakHours(thisWeekSessions);
        
        // Calculate completion rate
        const completedSessions = thisWeekSessions.filter(s => s.completed).length;
        const completionRate = thisWeekSessions.length > 0 
          ? Math.round((completedSessions / thisWeekSessions.length) * 100) 
          : 0;

        // Calculate average distractions
        const totalDistractions = thisWeekSessions.reduce((sum, s) => sum + (s.distractions || 0), 0);
        const avgDistractions = thisWeekSessions.length > 0 
          ? Math.round((totalDistractions / thisWeekSessions.length) * 10) / 10
          : 0;

        setMetrics({
          currentFocusScore: currentScore,
          focusScoreTrend: trend,
          peakHours,
          completionRate,
          avgDistractions,
          weeklyGoal: 10, // This could come from user preferences
          weeklyProgress: thisWeekSessions.length
        });

        // Generate insights
        const generatedInsights = FocusScoreCalculator.generateInsights(
          currentScore, 
          previousScore, 
          thisWeekSessions
        );
        setInsights(generatedInsights);
      }
    } catch (error) {
      console.error('Error fetching focus metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePeakHours = (sessions: any[]): string => {
    if (sessions.length === 0) return '9:00 AM - 11:00 AM';

    // Group sessions by hour
    const hourCounts: Record<number, number> = {};
    
    sessions.forEach(session => {
      const hour = new Date(session.start_time).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    // Find the hour with most sessions
    const peakHour = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0];

    if (peakHour) {
      const hour = parseInt(peakHour);
      const startTime = formatHour(hour);
      const endTime = formatHour(hour + 2);
      return `${startTime} - ${endTime}`;
    }

    return '9:00 AM - 11:00 AM';
  };

  const formatHour = (hour: number): string => {
    const adjustedHour = hour % 12 || 12;
    const period = hour < 12 ? 'AM' : 'PM';
    return `${adjustedHour}:00 ${period}`;
  };

  return {
    metrics,
    insights,
    isLoading,
    refetch: fetchMetrics
  };
};
