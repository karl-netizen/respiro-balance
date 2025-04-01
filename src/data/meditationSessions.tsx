
import { Brain, Moon, Sun, Leaf, ThumbsUp, Heart, CloudMoon, CloudSun, Award, Clock, Zap, Wind, Sparkles, Music } from "lucide-react";
import { MeditationSession } from '@/components/meditation/MeditationSessionCard';

// Expanded meditation sessions data with more diverse content
export const meditationSessions: MeditationSession[] = [
  {
    id: 'guided-1',
    title: 'Morning Clarity',
    description: 'Start your day with a clear mind and positive intentions.',
    duration: 10,
    category: 'guided',
    level: 'beginner',
    icon: <Sun className="h-5 w-5 text-orange-400" />,
    instructor: 'Sarah Johnson',
    tags: ['morning', 'focus', 'clarity']
  },
  {
    id: 'guided-2',
    title: 'Midday Reset',
    description: 'Reset your mind in the middle of your day to restore focus.',
    duration: 15,
    category: 'guided',
    level: 'intermediate',
    icon: <Brain className="h-5 w-5 text-blue-400" />,
    instructor: 'Michael Chen',
    tags: ['midday', 'focus', 'energy']
  },
  {
    id: 'guided-3',
    title: 'Evening Unwinding',
    description: 'Unwind from your day and prepare for a restful night.',
    duration: 20,
    category: 'guided',
    level: 'beginner',
    icon: <Moon className="h-5 w-5 text-indigo-400" />,
    instructor: 'Emily Rodriguez',
    tags: ['evening', 'relax', 'unwind']
  },
  {
    id: 'quick-1',
    title: 'Quick Focus',
    description: 'A 3-minute focus booster for when you need a quick reset.',
    duration: 3,
    category: 'quick',
    level: 'beginner',
    icon: <ThumbsUp className="h-5 w-5 text-green-400" />,
    instructor: 'James Wilson',
    tags: ['quick', 'focus', 'boost']
  },
  {
    id: 'quick-2',
    title: 'Breath Awareness',
    description: 'A short practice to bring mindfulness to your breathing.',
    duration: 5,
    category: 'quick',
    level: 'beginner',
    icon: <Leaf className="h-5 w-5 text-green-500" />,
    instructor: 'Maya Patel',
    tags: ['breathing', 'mindfulness', 'quick']
  },
  {
    id: 'deep-1',
    title: 'Deep Concentration',
    description: 'Develop sustained attention and focus with this deeper practice.',
    duration: 25,
    category: 'deep',
    level: 'advanced',
    icon: <Brain className="h-5 w-5 text-purple-500" />,
    instructor: 'David Kim',
    tags: ['concentration', 'focus', 'advanced']
  },
  {
    id: 'deep-2',
    title: 'Mindful Presence',
    description: 'A longer session for developing complete mindful awareness.',
    duration: 30,
    category: 'deep',
    level: 'intermediate',
    icon: <Heart className="h-5 w-5 text-pink-500" />,
    instructor: 'Sophia Martinez',
    tags: ['mindfulness', 'awareness', 'presence']
  },
  {
    id: 'sleep-1',
    title: 'Sleep Preparation',
    description: 'Calm your mind and prepare your body for restful sleep.',
    duration: 15,
    category: 'sleep',
    level: 'beginner',
    icon: <Moon className="h-5 w-5 text-blue-300" />,
    instructor: 'Nathan Brown',
    tags: ['sleep', 'relaxation', 'evening']
  },
  // Additional sessions
  {
    id: 'guided-4',
    title: 'Body Scan Relaxation',
    description: 'A guided journey through your body to release tension and find deep relaxation.',
    duration: 18,
    category: 'guided',
    level: 'beginner',
    icon: <Sparkles className="h-5 w-5 text-yellow-400" />,
    instructor: 'Lisa Thompson',
    tags: ['body scan', 'relaxation', 'tension']
  },
  {
    id: 'guided-5',
    title: 'Gratitude Practice',
    description: 'Cultivate appreciation and positive emotions through guided gratitude meditation.',
    duration: 12,
    category: 'guided',
    level: 'beginner',
    icon: <Heart className="h-5 w-5 text-red-400" />,
    instructor: 'Carlos Mendez',
    tags: ['gratitude', 'positivity', 'emotions']
  },
  {
    id: 'deep-3',
    title: 'Visualization Mastery',
    description: 'Use the power of your imagination to create mental clarity and manifest your goals.',
    duration: 22,
    category: 'deep',
    level: 'intermediate',
    icon: <Brain className="h-5 w-5 text-indigo-500" />,
    instructor: 'Rachel Lee',
    tags: ['visualization', 'manifestation', 'goals']
  },
  {
    id: 'sleep-2',
    title: 'Deep Sleep Journey',
    description: 'A longer meditation designed to transition you into deep, restorative sleep.',
    duration: 45,
    category: 'sleep',
    level: 'intermediate',
    icon: <CloudMoon className="h-5 w-5 text-indigo-300" />,
    instructor: 'Thomas Moore',
    tags: ['deep sleep', 'restoration', 'night']
  },
  {
    id: 'quick-3',
    title: 'One-Minute Calm',
    description: 'An ultra-quick reset for when you need instant relief from stress or anxiety.',
    duration: 1,
    category: 'quick',
    level: 'beginner',
    icon: <Clock className="h-5 w-5 text-gray-500" />,
    instructor: 'Olivia Garcia',
    tags: ['stress relief', 'quick', 'calm']
  },
  {
    id: 'deep-4',
    title: 'Advanced Awareness',
    description: 'For experienced meditators seeking to deepen their practice and awareness.',
    duration: 40,
    category: 'deep',
    level: 'advanced',
    icon: <Award className="h-5 w-5 text-amber-500" />,
    instructor: 'Robert Chen',
    tags: ['advanced', 'awareness', 'deep practice']
  },
  {
    id: 'guided-6',
    title: 'Loving-Kindness',
    description: 'Develop compassion for yourself and others through this heart-centered practice.',
    duration: 15,
    category: 'guided',
    level: 'intermediate',
    icon: <Heart className="h-5 w-5 text-pink-400" />,
    instructor: 'Amara Wilson',
    tags: ['compassion', 'loving-kindness', 'heart']
  },
  {
    id: 'sleep-3',
    title: 'Bedtime Wind-Down',
    description: 'Gentle guidance to help you process your day and prepare for restorative sleep.',
    duration: 10,
    category: 'sleep',
    level: 'beginner',
    icon: <Wind className="h-5 w-5 text-blue-300" />,
    instructor: 'Samuel Johnson',
    tags: ['bedtime', 'wind-down', 'sleep']
  }
];
