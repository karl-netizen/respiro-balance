
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
      check: () => sessions.length > 0
    },
    { 
      name: "Steady Mind", 
      description: "Meditate for 5 days in a row", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "brain",
      check: () => calculateStreak(sessions) >= 5
    },
    { 
      name: "Focus Master", 
      description: "Complete 10 focus meditations", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "target",
      check: () => sessions.filter(s => 
        s.session_type.toLowerCase().includes('focus')
      ).length >= 10
    },
    { 
      name: "Breath Explorer", 
      description: "Try all breathing techniques", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "wind",
      // This is a placeholder check - in a real app, you'd check for specific session types
      check: () => new Set(sessions.map(s => s.session_type)).size >= 4
    },
    { 
      name: "Consistency King", 
      description: "Complete a 10-day streak", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "calendar",
      check: () => calculateStreak(sessions) >= 10
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
      }
    },
    { 
      name: "Deep Diver", 
      description: "Complete a 20-minute session", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "anchor",
      check: () => sessions.some(s => s.duration >= 20)
    },
    { 
      name: "Zen Master", 
      description: "Achieve a 30-day streak", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "award",
      check: () => calculateStreak(sessions) >= 30
    }
  ];
  
  // For each achievement, check if it's unlocked
  return achievements.map(achievement => {
    const isUnlocked = achievement.check();
    
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
        icon: achievement.icon
      };
    }
    
    return {
      name: achievement.name,
      description: achievement.description,
      unlocked: false,
      icon: achievement.icon
    };
  });
}
