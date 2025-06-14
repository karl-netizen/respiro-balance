
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { MeditationStats as MeditationStatsType } from './types/meditationStats';

export interface MeditationStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  weeklyMinutes: number;
  weeklyGoal: number;
  averageSessionLength: number;
  lastSessionDate: string;
  monthlyTrend: number[];
  completionRate: number;
  focusScores: number[];
  stressScores: number[];
}

export const useMeditationStats = () => {
  const { user } = useAuth();
  const [meditationStats, setMeditationStats] = useState<MeditationStats>({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    weeklyMinutes: 0,
    weeklyGoal: 70,
    averageSessionLength: 0,
    lastSessionDate: '',
    monthlyTrend: [20, 35, 45, 30, 55, 40, 60, 45, 70, 50, 80, 65],
    completionRate: 0,
    focusScores: [],
    stressScores: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchMeditationStats = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Fetch meditation sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      // Calculate stats
      const totalSessions = sessions?.length || 0;
      const totalMinutes = sessions?.reduce((sum, session) => sum + (session.duration || 0), 0) || 0;
      const averageSessionLength = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

      // Calculate weekly minutes (last 7 days)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const weeklyMinutes = sessions?.filter(session => 
        new Date(session.completed_at) >= oneWeekAgo
      ).reduce((sum, session) => sum + (session.duration || 0), 0) || 0;

      // Calculate current streak
      let currentStreak = 0;
      if (sessions && sessions.length > 0) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Check if there's a session today or yesterday to start counting
        const recentSession = sessions.find(session => {
          const sessionDate = new Date(session.completed_at);
          return sessionDate.toDateString() === today.toDateString() || 
                 sessionDate.toDateString() === yesterday.toDateString();
        });
        
        if (recentSession) {
          // Count consecutive days with sessions
          const sessionDates = new Set(
            sessions.map(session => new Date(session.completed_at).toDateString())
          );
          
          let checkDate = new Date();
          while (sessionDates.has(checkDate.toDateString())) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          }
        }
      }

      // Calculate completion rate (sessions completed vs planned in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentSessions = sessions?.filter(session => 
        new Date(session.completed_at) >= thirtyDaysAgo
      ) || [];
      
      const completionRate = Math.min(100, Math.round((recentSessions.length / 30) * 100));

      const lastSessionDate = sessions && sessions.length > 0 
        ? new Date(sessions[0].completed_at).toLocaleDateString()
        : '';

      setMeditationStats({
        totalSessions,
        totalMinutes,
        currentStreak,
        longestStreak: Math.max(currentStreak, meditationStats.longestStreak),
        weeklyMinutes,
        weeklyGoal: 70,
        averageSessionLength,
        lastSessionDate,
        monthlyTrend: [20, 35, 45, 30, 55, 40, 60, 45, 70, 50, 80, 65],
        completionRate,
        focusScores: sessions?.map(s => s.focus_score || 7).slice(0, 10) || [],
        stressScores: sessions?.map(s => 10 - (s.stress_level || 3)).slice(0, 10) || []
      });

    } catch (error) {
      console.error('Error fetching meditation stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeditationStats();
  }, [user]);

  return {
    meditationStats,
    isLoading,
    refreshStats: fetchMeditationStats
  };
};
