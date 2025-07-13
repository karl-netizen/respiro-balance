
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface FocusStats {
  focusScore: number;
  currentStreak: number;
  todaysSessions: number;
  weeklyProgress: number;
  totalMinutes: number;
  completionRate: number;
}

export const useFocusStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<FocusStats>({
    focusScore: 0,
    currentStreak: 0,
    todaysSessions: 0,
    weeklyProgress: 0,
    totalMinutes: 0,
    completionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFocusStats();
    }
  }, [user]);

  const fetchFocusStats = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Get today's date range
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

      // Get this week's date range
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      // Fetch today's sessions
      const { data: todaysSessions, error: todaysError } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_time', startOfDay.toISOString())
        .lt('start_time', endOfDay.toISOString());

      if (todaysError) throw todaysError;

      // Fetch this week's sessions
      const { data: weekSessions, error: weekError } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_time', startOfWeek.toISOString());

      if (weekError) throw weekError;

      // Fetch all sessions for streak calculation
      const { data: allSessions, error: allError } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });

      if (allError) throw allError;

      // Calculate stats
      const completedToday = todaysSessions?.filter(s => s.completed).length || 0;
      const completedThisWeek = weekSessions?.filter(s => s.completed).length || 0;
      const totalWeekMinutes = weekSessions?.reduce((sum, s) => sum + (s.duration || 0), 0) || 0;
      
      // Calculate focus score (average of recent sessions)
      const recentSessions = weekSessions?.slice(0, 10) || [];
      const avgFocusScore = recentSessions.length > 0 
        ? recentSessions.reduce((sum, s) => sum + (s.focus_score || 70), 0) / recentSessions.length 
        : 0;

      // Calculate current streak
      const currentStreak = calculateCurrentStreak(allSessions || []);

      // Calculate completion rate
      const totalSessions = allSessions?.length || 0;
      const completedSessions = allSessions?.filter(s => s.completed).length || 0;
      const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

      setStats({
        focusScore: Math.round(avgFocusScore),
        currentStreak,
        todaysSessions: completedToday,
        weeklyProgress: Math.min((completedThisWeek / 15) * 100, 100), // Goal of 15 sessions per week
        totalMinutes: totalWeekMinutes,
        completionRate: Math.round(completionRate)
      });

    } catch (error) {
      console.error('Error fetching focus stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCurrentStreak = (sessions: any[]): number => {
    if (sessions.length === 0) return 0;

    const completedSessions = sessions.filter(s => s.completed);
    if (completedSessions.length === 0) return 0;

    // Group sessions by date
    const sessionsByDate = new Map<string, any[]>();
    completedSessions.forEach(session => {
      const date = new Date(session.start_time).toDateString();
      if (!sessionsByDate.has(date)) {
        sessionsByDate.set(date, []);
      }
      sessionsByDate.get(date)!.push(session);
    });

    // Calculate streak
    let streak = 0;
    const today = new Date();
    let currentDate = new Date(today);

    while (true) {
      const dateString = currentDate.toDateString();
      if (sessionsByDate.has(dateString)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        // Allow one day gap for today if no sessions yet
        if (streak === 0 && dateString === today.toDateString()) {
          currentDate.setDate(currentDate.getDate() - 1);
          continue;
        }
        break;
      }
    }

    return streak;
  };

  return {
    stats,
    isLoading,
    refreshStats: fetchFocusStats
  };
};
