// Demo data constants for Respiro Balance
import { User } from '@supabase/supabase-js';

export const DEMO_USER: any = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'demo@respiro.app',
  full_name: 'Alex Demo',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo&backgroundColor=b6e3f4',
  subscription_tier: 'premium',
  subscription_status: 'active',
  subscription_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  meditation_minutes_used: 180,
  meditation_minutes_limit: 1000,
  biometric_sync_enabled: true,
  last_active: new Date().toISOString(),
  created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
};

export const DEMO_USER_PREFERENCES = {
  id: 'demo-prefs-123',
  user_id: '00000000-0000-0000-0000-000000000001',
  work_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  work_start_time: '09:00',
  work_end_time: '17:30',
  lunch_time: '12:30',
  lunch_break: true,
  exercise_time: '07:00',
  morning_exercise: true,
  bed_time: '22:30',
  meditation_experience: 'intermediate',
  meditation_goals: ['stress_reduction', 'better_sleep', 'focus_improvement'],
  stress_level: 'moderate',
  work_environment: 'hybrid',
  preferred_session_duration: 15,
  theme: 'system',
  has_completed_onboarding: true,
  notification_settings: {
    streak_alerts: true,
    weekly_summary: true,
    session_reminders: true,
    achievement_notifications: true
  },
  connected_devices: []
};

export const DEMO_MEDITATION_SESSIONS = [
  {
    id: 'demo-session-1',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Morning Clarity',
    session_type: 'guided',
    category: 'mindfulness',
    duration: 900, // 15 minutes
    completed: true,
    completed_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    started_at: new Date(Date.now() - 2 * 60 * 60 * 1000 - 900 * 1000).toISOString(),
    rating: 5,
    favorite: true,
    difficulty: 'beginner',
    instructor: 'Sarah Chen',
    description: 'Start your day with clarity and intention',
    tags: ['morning', 'clarity', 'focus']
  },
  {
    id: 'demo-session-2',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Stress Release',
    session_type: 'breathing',
    category: 'stress-relief',
    duration: 600, // 10 minutes
    completed: true,
    completed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // yesterday
    started_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 600 * 1000).toISOString(),
    rating: 4,
    favorite: false,
    difficulty: 'intermediate',
    instructor: 'Marcus Johnson',
    description: 'Release tension and find calm',
    tags: ['stress', 'breathing', 'relaxation']
  },
  {
    id: 'demo-session-3',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Deep Sleep Preparation',
    session_type: 'sleep',
    category: 'sleep',
    duration: 1200, // 20 minutes
    completed: true,
    completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    started_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 1200 * 1000).toISOString(),
    rating: 5,
    favorite: true,
    difficulty: 'beginner',
    instructor: 'Luna Rodriguez',
    description: 'Prepare your mind and body for restful sleep',
    tags: ['sleep', 'bedtime', 'relaxation']
  }
];

export const DEMO_FOCUS_SESSIONS = [
  {
    id: 'demo-focus-1',
    user_id: '00000000-0000-0000-0000-000000000001',
    start_time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    end_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    duration: 3600, // 1 hour
    completed: true,
    work_intervals: 4,
    break_intervals: 3,
    focus_score: 92,
    distractions: 2,
    notes: 'Great focus session on the quarterly report',
    tags: ['work', 'report', 'deep-work']
  },
  {
    id: 'demo-focus-2',
    user_id: '00000000-0000-0000-0000-000000000001',
    start_time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // yesterday
    end_time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 1800 * 1000).toISOString(),
    duration: 1800, // 30 minutes
    completed: true,
    work_intervals: 2,
    break_intervals: 1,
    focus_score: 88,
    distractions: 1,
    notes: 'Quick focused session for email processing',
    tags: ['email', 'admin', 'quick-session']
  }
];

export const DEMO_ACHIEVEMENTS = [
  {
    id: 'demo-achievement-1',
    user_id: '00000000-0000-0000-0000-000000000001',
    achievement_key: 'first_meditation',
    progress: 100,
    unlocked_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'demo-achievement-2',
    user_id: '00000000-0000-0000-0000-000000000001',
    achievement_key: '7_day_streak',
    progress: 100,
    unlocked_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'demo-achievement-3',
    user_id: '00000000-0000-0000-0000-000000000001',
    achievement_key: '50_sessions',
    progress: 90,
    unlocked_at: null
  }
];

export const DEMO_SOCIAL_PROFILE = {
  id: 'demo-social-123',
  user_id: '00000000-0000-0000-0000-000000000001',
  display_name: 'Alex Demo',
  bio: 'Finding balance in a busy world 🧘‍♂️ Premium member since day one',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo&backgroundColor=b6e3f4',
  level: 12,
  total_points: 2840,
  current_streak: 7,
  longest_streak: 21,
  privacy_settings: {
    profile_visibility: 'public',
    activity_visibility: 'public',
    leaderboard_participation: true
  }
};

export const DEMO_REWARDS = {
  id: 'demo-rewards-123',
  user_id: '00000000-0000-0000-0000-000000000001',
  coin_balance: 450,
  total_coins_earned: 1250,
  total_coins_spent: 800,
  active_badges: [
    { type: 'streak', level: 'gold', earned_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
    { type: 'focus', level: 'silver', earned_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { type: 'mindfulness', level: 'bronze', earned_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() }
  ],
  reward_inventory: [
    { item: 'premium_theme', quantity: 1 },
    { item: 'guided_session_pack', quantity: 3 }
  ]
};

export const DEMO_MORNING_RITUALS = [
  {
    id: 'demo-ritual-1',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Morning Meditation',
    description: 'Start the day with 10 minutes of mindful breathing',
    start_time: '07:00',
    duration: 600, // 10 minutes
    recurrence: 'daily',
    days_of_week: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    priority: 'high',
    status: 'active',
    streak: 7,
    last_completed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    reminder_enabled: true,
    reminder_time: 15, // 15 minutes before
    tags: ['meditation', 'morning', 'daily']
  },
  {
    id: 'demo-ritual-2',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Gratitude Journaling',
    description: 'Write down 3 things I\'m grateful for',
    start_time: '07:15',
    duration: 300, // 5 minutes
    recurrence: 'daily',
    days_of_week: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    priority: 'medium',
    status: 'active',
    streak: 12,
    last_completed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reminder_enabled: true,
    reminder_time: 5,
    tags: ['gratitude', 'journaling', 'mindfulness']
  }
];

export const DEMO_BIOMETRIC_DATA = [
  {
    id: 'demo-bio-1',
    user_id: '00000000-0000-0000-0000-000000000001',
    session_id: 'demo-session-1',
    recorded_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    heart_rate: 68,
    hrv: 45,
    respiratory_rate: 12,
    stress_score: 25,
    coherence: 85,
    device_source: 'Apple Watch'
  },
  {
    id: 'demo-bio-2',
    user_id: '00000000-0000-0000-0000-000000000001',
    session_id: 'demo-session-2',
    recorded_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    heart_rate: 72,
    hrv: 42,
    respiratory_rate: 14,
    stress_score: 35,
    coherence: 78,
    device_source: 'Fitbit'
  }
];

// Statistics and analytics
export const DEMO_STATS = {
  totalSessions: 45,
  totalMinutes: 720,
  currentStreak: 7,
  longestStreak: 21,
  averageSessionLength: 16,
  favoriteCategory: 'mindfulness',
  weeklyGoal: 60, // minutes
  weeklyProgress: 85, // percentage
  monthlyGoal: 240, // minutes
  monthlyProgress: 75 // percentage
};

export const DEMO_WEEKLY_PROGRESS = [
  { day: 'Mon', minutes: 15, sessions: 1 },
  { day: 'Tue', minutes: 20, sessions: 1 },
  { day: 'Wed', minutes: 0, sessions: 0 },
  { day: 'Thu', minutes: 25, sessions: 2 },
  { day: 'Fri', minutes: 15, sessions: 1 },
  { day: 'Sat', minutes: 30, sessions: 2 },
  { day: 'Sun', minutes: 20, sessions: 1 }
];

export const DEMO_MOOD_TRACKING = [
  { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], mood: 8, energy: 7, stress: 3 },
  { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], mood: 7, energy: 6, stress: 4 },
  { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], mood: 9, energy: 8, stress: 2 },
  { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], mood: 8, energy: 7, stress: 3 },
  { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], mood: 6, energy: 5, stress: 6 },
  { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], mood: 8, energy: 7, stress: 3 },
  { date: new Date().toISOString().split('T')[0], mood: 9, energy: 8, stress: 2 }
];