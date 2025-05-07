
// Define achievement types and criteria
const achievementDefinitions = [
  {
    key: 'first-session',
    name: 'First Steps',
    description: 'Complete your first meditation session',
    icon: 'star',
    criteria: { type: 'total_sessions', threshold: 1 }
  },
  {
    key: 'consistent-3-days',
    name: 'Consistency Beginner',
    description: 'Meditate for 3 days in a row',
    icon: 'flame',
    criteria: { type: 'streak', threshold: 3 }
  },
  {
    key: 'consistent-7-days',
    name: 'Weekly Warrior',
    description: 'Meditate for 7 days in a row',
    icon: 'flame',
    criteria: { type: 'streak', threshold: 7 }
  },
  {
    key: 'consistent-30-days',
    name: 'Mindfulness Master',
    description: 'Meditate for 30 days in a row',
    icon: 'flame',
    criteria: { type: 'streak', threshold: 30 }
  },
  {
    key: 'total-1-hour',
    name: 'Hour of Calm',
    description: 'Accumulate 60 minutes of meditation',
    icon: 'clock',
    criteria: { type: 'total_minutes', threshold: 60 }
  },
  {
    key: 'total-5-hours',
    name: 'Zen Journeyer',
    description: 'Accumulate 300 minutes of meditation',
    icon: 'clock',
    criteria: { type: 'total_minutes', threshold: 300 }
  },
  {
    key: 'total-10-sessions',
    name: 'Regular Meditator',
    description: 'Complete 10 meditation sessions',
    icon: 'check',
    criteria: { type: 'total_sessions', threshold: 10 }
  },
  {
    key: 'total-50-sessions',
    name: 'Meditation Enthusiast',
    description: 'Complete 50 meditation sessions',
    icon: 'trophy',
    criteria: { type: 'total_sessions', threshold: 50 }
  },
  {
    key: 'total-100-sessions',
    name: 'Meditation Century',
    description: 'Complete 100 meditation sessions',
    icon: 'trophy',
    criteria: { type: 'total_sessions', threshold: 100 }
  },
  {
    key: 'completion-rate-80',
    name: 'Focused Finisher',
    description: 'Achieve 80% completion rate on your sessions',
    icon: 'target',
    criteria: { type: 'completion_rate', threshold: 80 }
  }
];

// Calculate achievements based on user's meditation data
export const calculateAchievements = (sessions: any[]) => {
  if (!sessions.length) return achievementDefinitions.map(a => ({ ...a, unlocked: false, progress: 0 }));
  
  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  
  // Calculate streak (simplified version for this purpose)
  const streak = calculateStreak();
  
  // Calculate completion rate
  const completionRate = Math.round((sessions.filter(s => s.completed).length / sessions.length) * 100);
  
  // Simple function to calculate streak (would use more sophisticated logic in real app)
  function calculateStreak() {
    // This is a simplified placeholder - in production, would call the streak function from streakUtils
    return 5; // Mock value
  }
  
  return achievementDefinitions.map(achievement => {
    let progress = 0;
    let unlocked = false;
    
    switch (achievement.criteria.type) {
      case 'total_sessions':
        progress = (totalSessions / achievement.criteria.threshold) * 100;
        unlocked = totalSessions >= achievement.criteria.threshold;
        break;
      case 'total_minutes':
        progress = (totalMinutes / achievement.criteria.threshold) * 100;
        unlocked = totalMinutes >= achievement.criteria.threshold;
        break;
      case 'streak':
        progress = (streak / achievement.criteria.threshold) * 100;
        unlocked = streak >= achievement.criteria.threshold;
        break;
      case 'completion_rate':
        progress = completionRate;
        unlocked = completionRate >= achievement.criteria.threshold;
        break;
    }
    
    return {
      ...achievement,
      unlocked,
      progress: Math.min(100, Math.round(progress)),
      // If unlocked, add a random past date as the unlocked date
      unlockedDate: unlocked ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined
    };
  });
};
