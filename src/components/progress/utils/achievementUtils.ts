
import { calculateStreak } from './streakUtils';
import { Achievement } from '../types/meditationStats';

// Helper function to calculate achievements
export function calculateAchievements(sessions: any[]): Achievement[] {
  const achievements = [
    { 
      name: "First Steps", 
      description: "Complete your first meditation", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "footprints",
      check: () => sessions.length > 0,
      getProgress: () => sessions.length > 0 ? 100 : 0
    },
    { 
      name: "Steady Mind", 
      description: "Meditate for 5 days in a row", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "brain",
      check: () => calculateStreak(sessions) >= 5,
      getProgress: () => Math.min(100, (calculateStreak(sessions) / 5) * 100)
    },
    { 
      name: "Focus Master", 
      description: "Complete 10 focus meditations", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "target",
      check: () => sessions.filter(s => 
        s.session_type.toLowerCase().includes('focus')
      ).length >= 10,
      getProgress: () => Math.min(100, (sessions.filter(s => 
        s.session_type.toLowerCase().includes('focus')
      ).length / 10) * 100)
    },
    { 
      name: "Breath Explorer", 
      description: "Try all breathing techniques", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "wind",
      // This is a placeholder check - in a real app, you'd check for specific session types
      check: () => new Set(sessions.map(s => s.session_type)).size >= 4,
      getProgress: () => Math.min(100, (new Set(sessions.map(s => s.session_type)).size / 4) * 100)
    },
    { 
      name: "Consistency King", 
      description: "Complete a 10-day streak", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "calendar",
      check: () => calculateStreak(sessions) >= 10,
      getProgress: () => Math.min(100, (calculateStreak(sessions) / 10) * 100)
    },
    { 
      name: "Morning Person", 
      description: "Complete 7 morning meditations", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "sunrise",
      check: () => {
        const morningCount = sessions.filter(s => {
          const sessionHour = new Date(s.started_at).getHours();
          return sessionHour >= 5 && sessionHour <= 10; // Between 5am and 10am
        }).length;
        return morningCount >= 7;
      },
      getProgress: () => {
        const morningCount = sessions.filter(s => {
          const sessionHour = new Date(s.started_at).getHours();
          return sessionHour >= 5 && sessionHour <= 10; // Between 5am and 10am
        }).length;
        return Math.min(100, (morningCount / 7) * 100);
      }
    },
    { 
      name: "Deep Diver", 
      description: "Complete a 20-minute session", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "anchor",
      check: () => sessions.some(s => s.duration >= 20),
      getProgress: () => {
        const longestSession = sessions.reduce((max, s) => Math.max(max, s.duration), 0);
        return Math.min(100, (longestSession / 20) * 100);
      }
    },
    { 
      name: "Zen Master", 
      description: "Achieve a 30-day streak", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "award",
      check: () => calculateStreak(sessions) >= 30,
      getProgress: () => Math.min(100, (calculateStreak(sessions) / 30) * 100)
    },
    { 
      name: "Century Club", 
      description: "Complete 100 meditation sessions", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "trophy",
      check: () => sessions.filter(s => s.completed).length >= 100,
      getProgress: () => Math.min(100, (sessions.filter(s => s.completed).length / 100) * 100)
    },
    { 
      name: "Time Traveler", 
      description: "Accumulate 1000 minutes of meditation", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "clock",
      check: () => sessions.filter(s => s.completed).reduce((total, s) => total + s.duration, 0) >= 1000,
      getProgress: () => {
        const totalMinutes = sessions.filter(s => s.completed).reduce((total, s) => total + s.duration, 0);
        return Math.min(100, (totalMinutes / 1000) * 100);
      }
    }
  ];
  
  // For each achievement, check if it's unlocked and calculate progress
  return achievements.map(achievement => {
    const isUnlocked = achievement.check();
    const progress = achievement.getProgress();
    
    // If it's unlocked, add a mock unlocked date
    // In a real app, you would store these in the database
    if (isUnlocked) {
      const daysAgo = Math.floor(Math.random() * 14) + 1; // Random day in the last 2 weeks
      const unlockedDate = new Date();
      unlockedDate.setDate(unlockedDate.getDate() - daysAgo);
      
      const timeDescriptions = [
        "1 day ago", "2 days ago", "3 days ago", "4 days ago", "5 days ago",
        "6 days ago", "1 week ago", "2 weeks ago"
      ];
      
      return {
        name: achievement.name,
        description: achievement.description,
        unlocked: true,
        unlockedDate: timeDescriptions[Math.min(daysAgo - 1, timeDescriptions.length - 1)],
        icon: achievement.icon,
        progress: 100
      };
    }
    
    return {
      name: achievement.name,
      description: achievement.description,
      unlocked: false,
      icon: achievement.icon,
      progress: Math.round(progress)
    };
  });
}
