
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export interface MeditationStats {
  totalSessions: number;
  totalMinutes: number;
  weeklyMinutes: number;
  averageSessionLength: number;
  currentStreak: number;
  longestStreak: number;
  favoriteSessionType: string;
  completionRate: number;
}

export const useMeditationStats = () => {
  const { user } = useAuth();
  const [meditationStats, setMeditationStats] = useState<MeditationStats>({
    totalSessions: 0,
    totalMinutes: 0,
    weeklyMinutes: 0,
    averageSessionLength: 0,
    currentStreak: 0,
    longestStreak: 0,
    favoriteSessionType: 'guided',
    completionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Get all meditation sessions for the user
        const { data: sessions, error } = await supabase
          .from('meditation_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('started_at', { ascending: false });

        if (error) throw error;

        if (sessions) {
          const completedSessions = sessions.filter(s => s.completed);
          const totalSessions = completedSessions.length;
          const totalMinutes = completedSessions.reduce((sum, s) => sum + s.duration, 0);
          
          // Calculate weekly minutes (last 7 days)
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          const weeklyMinutes = completedSessions
            .filter(s => new Date(s.started_at) > weekAgo)
            .reduce((sum, s) => sum + s.duration, 0);

          // Calculate average session length
          const averageSessionLength = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

          // Calculate current streak
          let currentStreak = 0;
          const today = new Date();
          let checkDate = new Date(today);
          
          while (true) {
            const dayStart = new Date(checkDate);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(checkDate);
            dayEnd.setHours(23, 59, 59, 999);
            
            const hasSessionToday = completedSessions.some(s => {
              const sessionDate = new Date(s.started_at);
              return sessionDate >= dayStart && sessionDate <= dayEnd;
            });
            
            if (hasSessionToday) {
              currentStreak++;
              checkDate.setDate(checkDate.getDate() - 1);
            } else {
              break;
            }
          }

          // Find favorite session type
          const sessionTypes = completedSessions.reduce((acc, s) => {
            acc[s.session_type] = (acc[s.session_type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          const favoriteSessionType = Object.entries(sessionTypes)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'guided';

          // Calculate completion rate
          const completionRate = sessions.length > 0 
            ? Math.round((completedSessions.length / sessions.length) * 100) 
            : 0;

          setMeditationStats({
            totalSessions,
            totalMinutes,
            weeklyMinutes,
            averageSessionLength,
            currentStreak,
            longestStreak: currentStreak, // Simplified for now
            favoriteSessionType,
            completionRate
          });
        }
      } catch (error) {
        console.error('Error fetching meditation stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return {
    meditationStats,
    isLoading
  };
};
