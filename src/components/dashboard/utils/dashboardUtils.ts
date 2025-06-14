
import React from 'react';
import { Activity, Clock, Target, Zap } from 'lucide-react';

export const generateQuickStats = (
  currentStreak: number,
  weeklyProgress: number,
  weeklyGoal: number,
  meditationStats: any
) => {
  return [
    {
      title: "Current Streak",
      value: `${currentStreak} days`,
      icon: React.createElement(Zap, { className: "h-4 w-4 text-amber-500" }),
      description: "Consecutive meditation days"
    },
    {
      title: "This Week",
      value: `${weeklyProgress}/${weeklyGoal} min`,
      icon: React.createElement(Target, { className: "h-4 w-4 text-green-500" }),
      description: "Weekly meditation goal"
    },
    {
      title: "Total Sessions",
      value: meditationStats.totalSessions || 24,
      icon: React.createElement(Activity, { className: "h-4 w-4 text-blue-500" }),
      description: "Completed meditations"
    },
    {
      title: "Avg. Session",
      value: `${meditationStats.averageSessionLength || 12} min`,
      icon: React.createElement(Clock, { className: "h-4 w-4 text-purple-500" }),
      description: "Average session length"
    }
  ];
};
