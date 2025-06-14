
import { useState, useEffect } from 'react';
import { useSocialApi } from './useSocialApi';
import type { LeaderboardEntry } from '@/types/social';

type LeaderboardType = LeaderboardEntry['leaderboard_type'];
type TimePeriod = LeaderboardEntry['time_period'];

export function useLeaderboards() {
  const { fetchLeaderboard, isLoading } = useSocialApi();
  const [leaderboards, setLeaderboards] = useState<{
    [key in LeaderboardType]?: {
      [period in TimePeriod]?: LeaderboardEntry[];
    };
  }>({});

  const loadLeaderboard = async (type: LeaderboardType, period: TimePeriod = 'weekly') => {
    try {
      const entries = await fetchLeaderboard(type, period);
      
      setLeaderboards(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          [period]: entries
        }
      }));
      
      return entries;
    } catch (error) {
      console.error(`Failed to load ${type} leaderboard:`, error);
      return [];
    }
  };

  const getLeaderboard = (type: LeaderboardType, period: TimePeriod = 'weekly') => {
    return leaderboards[type]?.[period] || [];
  };

  const getUserRank = (type: LeaderboardType, period: TimePeriod = 'weekly', userId: string) => {
    const entries = getLeaderboard(type, period);
    const userEntry = entries.find(entry => entry.user_id === userId);
    return userEntry?.rank || null;
  };

  // Load initial data
  useEffect(() => {
    const types: LeaderboardType[] = ['meditation_minutes', 'focus_sessions', 'current_streak', 'weekly_points'];
    const periods: TimePeriod[] = ['weekly', 'monthly', 'all_time'];
    
    types.forEach(type => {
      periods.forEach(period => {
        loadLeaderboard(type, period);
      });
    });
  }, []);

  return {
    leaderboards,
    isLoading,
    loadLeaderboard,
    getLeaderboard,
    getUserRank,
  };
}
