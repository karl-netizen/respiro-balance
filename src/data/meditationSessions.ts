
import { MeditationSession } from '@/types/meditation';

export const meditationSessions: MeditationSession[] = [
  // Guided Meditation Sessions
  {
    id: "guided-morning-1",
    title: "Morning Mindfulness",
    description: "Start your day with clarity and purpose through this guided morning meditation.",
    duration: 10,
    level: "beginner",
    category: "guided",
    session_type: "guided",
    tags: ["morning", "mindfulness", "beginner"],
    instructor: "Sarah Wilson",
    audio_url: "guided-morning-1.mp3",
    image_url: "/images/meditations/morning-mindfulness.jpg"
  },
  {
    id: "guided-focus-1",
    title: "Focus Improvement",
    description: "Enhance your concentration and mental clarity with this guided focus meditation.",
    duration: 15,
    level: "intermediate",
    category: "guided",
    session_type: "guided",
    tags: ["focus", "concentration", "intermediate"],
    instructor: "Michael Chen",
    audio_url: "guided-focus-1.mp3",
    image_url: "/images/meditations/focus-meditation.jpg"
  },
  {
    id: "guided-stress-1",
    title: "Stress Release",
    description: "Let go of tension and find calm with this soothing stress relief meditation.",
    duration: 12,
    level: "beginner",
    category: "guided",
    session_type: "guided",
    tags: ["stress", "relaxation", "beginner"],
    instructor: "Emma Rodriguez",
    audio_url: "guided-stress-1.mp3",
    image_url: "/images/meditations/stress-release.jpg"
  },
  
  // Quick Break Sessions
  {
    id: "quick-breather-1",
    title: "1-Minute Breather",
    description: "A super quick reset for your mind between tasks or meetings.",
    duration: 1,
    level: "beginner",
    category: "quick",
    session_type: "quick",
    tags: ["quick", "break", "breath"],
    instructor: "Self-guided",
    audio_url: "quick-breather-1.mp3",
    image_url: "/images/meditations/one-minute-breather.jpg"
  },
  {
    id: "quick-break-5",
    title: "5-Minute Reset",
    description: "Perfect short break to clear your mind and refocus your energy.",
    duration: 5,
    level: "beginner",
    category: "quick",
    session_type: "quick",
    tags: ["quick", "reset", "energy"],
    instructor: "Alex Johnson",
    audio_url: "quick-break-5.mp3",
    image_url: "/images/meditations/five-minute-reset.jpg"
  },
  {
    id: "quick-calm-3",
    title: "3-Minute Calm",
    description: "Find your center quickly with this brief calming meditation.",
    duration: 3,
    level: "beginner",
    category: "quick",
    session_type: "quick",
    tags: ["quick", "calm", "centering"],
    instructor: "Self-guided",
    audio_url: "quick-calm-3.mp3",
    image_url: "/images/meditations/three-minute-calm.jpg"
  },
  
  // Deep Focus Sessions
  {
    id: "deep-concentration-1",
    title: "Deep Concentration",
    description: "Enter a flow state with this immersive focus meditation.",
    duration: 20,
    level: "advanced",
    category: "deep",
    session_type: "deep",
    tags: ["deep", "focus", "flow"],
    instructor: "David Park",
    audio_url: "deep-concentration-1.mp3",
    image_url: "/images/meditations/deep-concentration.jpg"
  },
  {
    id: "deep-awareness-1",
    title: "Present Awareness",
    description: "Cultivate deep present moment awareness with this extended meditation.",
    duration: 25,
    level: "intermediate",
    category: "deep",
    session_type: "deep",
    tags: ["awareness", "presence", "intermediate"],
    instructor: "Sophia Lee",
    audio_url: "deep-awareness-1.mp3",
    image_url: "/images/meditations/present-awareness.jpg",
    premium: true
  },
  {
    id: "deep-clarity-1",
    title: "Mental Clarity",
    description: "Clear mental fog and enhance cognitive function with this deep meditation.",
    duration: 18,
    level: "intermediate",
    category: "deep",
    session_type: "deep",
    tags: ["clarity", "cognitive", "intermediate"],
    instructor: "James Wilson",
    audio_url: "deep-clarity-1.mp3",
    image_url: "/images/meditations/mental-clarity.jpg"
  },
  
  // Sleep Sessions
  {
    id: "sleep-relaxation-1",
    title: "Sleep Relaxation",
    description: "Gentle guidance into deep relaxation to prepare for restful sleep.",
    duration: 15,
    level: "beginner",
    category: "sleep",
    session_type: "sleep",
    tags: ["sleep", "relaxation", "beginner"],
    instructor: "Olivia Chen",
    audio_url: "sleep-relaxation-1.mp3",
    image_url: "/images/meditations/sleep-relaxation.jpg"
  },
  {
    id: "sleep-deep-1",
    title: "Deep Sleep Journey",
    description: "A soothing journey to help you fall into deep, restorative sleep.",
    duration: 30,
    level: "beginner",
    category: "sleep",
    session_type: "sleep",
    tags: ["sleep", "deep", "journey"],
    instructor: "Robert Martinez",
    audio_url: "sleep-deep-1.mp3",
    image_url: "/images/meditations/deep-sleep-journey.jpg",
    premium: true
  },
  {
    id: "sleep-anxiety-1",
    title: "Sleep Anxiety Relief",
    description: "Release nighttime anxiety and prepare your mind for peaceful rest.",
    duration: 20,
    level: "intermediate",
    category: "sleep",
    session_type: "sleep",
    tags: ["sleep", "anxiety", "relief"],
    instructor: "Amara Johnson",
    audio_url: "sleep-anxiety-1.mp3",
    image_url: "/images/meditations/sleep-anxiety-relief.jpg"
  }
];
