
import { useState } from 'react';
import { Brain, Moon, Sun, Leaf, ThumbsUp, Heart } from "lucide-react";
import { MeditationSession } from '@/components/meditation/MeditationSessionCard';
import { useMeditationSessions } from './useMeditationSessions';

export const useMeditationLibrary = () => {
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const { startSession, completeSession, isStarting } = useMeditationSessions();
  
  // Sample meditation sessions data
  const meditationSessions: MeditationSession[] = [
    {
      id: 'guided-1',
      title: 'Morning Clarity',
      description: 'Start your day with a clear mind and positive intentions.',
      duration: 10,
      category: 'guided',
      level: 'beginner',
      icon: <Sun className="h-5 w-5 text-orange-400" />
    },
    {
      id: 'guided-2',
      title: 'Midday Reset',
      description: 'Reset your mind in the middle of your day to restore focus.',
      duration: 15,
      category: 'guided',
      level: 'intermediate',
      icon: <Brain className="h-5 w-5 text-blue-400" />
    },
    {
      id: 'guided-3',
      title: 'Evening Unwinding',
      description: 'Unwind from your day and prepare for a restful night.',
      duration: 20,
      category: 'guided',
      level: 'beginner',
      icon: <Moon className="h-5 w-5 text-indigo-400" />
    },
    {
      id: 'quick-1',
      title: 'Quick Focus',
      description: 'A 3-minute focus booster for when you need a quick reset.',
      duration: 3,
      category: 'quick',
      level: 'beginner',
      icon: <ThumbsUp className="h-5 w-5 text-green-400" />
    },
    {
      id: 'quick-2',
      title: 'Breath Awareness',
      description: 'A short practice to bring mindfulness to your breathing.',
      duration: 5,
      category: 'quick',
      level: 'beginner',
      icon: <Leaf className="h-5 w-5 text-green-500" />
    },
    {
      id: 'deep-1',
      title: 'Deep Concentration',
      description: 'Develop sustained attention and focus with this deeper practice.',
      duration: 25,
      category: 'deep',
      level: 'advanced',
      icon: <Brain className="h-5 w-5 text-purple-500" />
    },
    {
      id: 'deep-2',
      title: 'Mindful Presence',
      description: 'A longer session for developing complete mindful awareness.',
      duration: 30,
      category: 'deep',
      level: 'intermediate',
      icon: <Heart className="h-5 w-5 text-pink-500" />
    },
    {
      id: 'sleep-1',
      title: 'Sleep Preparation',
      description: 'Calm your mind and prepare your body for restful sleep.',
      duration: 15,
      category: 'sleep',
      level: 'beginner',
      icon: <Moon className="h-5 w-5 text-blue-300" />
    }
  ];
  
  const handleSelectSession = async (session: MeditationSession) => {
    setSelectedSession(session);
    // Start the session in the backend
    await startSession({ 
      sessionType: session.category, 
      duration: session.duration 
    });
  };
  
  const handleCompleteSession = async (sessionId: string) => {
    await completeSession(sessionId);
    setSelectedSession(null);
  };
  
  const filterSessionsByCategory = (category: 'guided' | 'quick' | 'deep' | 'sleep') => {
    return meditationSessions.filter(session => session.category === category);
  };

  return {
    meditationSessions,
    selectedSession,
    setSelectedSession,
    handleSelectSession,
    handleCompleteSession,
    filterSessionsByCategory,
    isStarting
  };
};
