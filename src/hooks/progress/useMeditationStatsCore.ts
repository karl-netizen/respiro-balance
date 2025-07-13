
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface MeditationStatsCore {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  weeklyMinutes: number;
  weeklyCompleted: number;
  averageSessionLength: number;
  completionRate: number;
  lastSessionDate: string;
}

export const useMeditationStatsCore = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<MeditationStatsCore>({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    weeklyMinutes: 0,
    weeklyCompleted: 0,
    averageSessionLength: 0,
    completionRate: 0,
    lastSessionDate: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      const { data: sessions, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      // Calculate core stats
      const totalSessions = sessions?.length || 0;
      const totalMinutes = sessions?.reduce((sum, session) => sum + (session.duration || 0), 0) || 0;
      const averageSessionLength = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

      // Calculate weekly stats
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const recentSessions = sessions?.filter(session => 
        new Date(session.completed_at) >= oneWeekAgo
      ) || [];
      
      const weeklyMinutes = recentSessions.reduce((sum, session) => sum + (session.duration || 0), 0);
      const weeklyCompleted = recentSessions.length;

      // Calculate streak
      let currentStreak = 0;
      if (sessions && sessions.length > 0) {
        const sessionDates = new Set(
          sessions.map(session => new Date(session.completed_at).toDateString())
        );
        
        let checkDate = new Date();
        while (sessionDates.has(checkDate.toDateString())) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
      }

      // Calculate completion rate
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const monthlySessions = sessions?.filter(session => 
        new Date(session.completed_at) >= thirtyDaysAgo
      ) || [];
      
      const completionRate = Math.min(100, Math.round((monthlySessions.length / 30) * 100));

      const lastSessionDate = sessions && sessions.length > 0 
        ? new Date(sessions[0].completed_at).toLocaleDateString()
        : '';

      setStats({
        totalSessions,
        totalMinutes,
        currentStreak,
        weeklyMinutes,
        weeklyCompleted,
        averageSessionLength,
        completionRate,
        lastSessionDate,
      });

    } catch (error) {
      console.error('Error fetching meditation stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return {
    stats,
    isLoading,
    refreshStats: fetchStats,
  };
};
