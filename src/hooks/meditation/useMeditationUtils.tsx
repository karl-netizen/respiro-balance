
import { Heart, Clock, User, Sparkles, Compass, Leaf, Mountain, Sun, Moon, Star } from 'lucide-react';

export const useMeditationUtils = () => {
  // Utility functions
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 90) return 'text-green-600';
    if (progress >= 50) return 'text-blue-600';
    return 'text-gray-400';
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconProps = { className: "h-5 w-5" };
    switch (category) {
      case 'Mindfulness': return <Compass {...iconProps} />;
      case 'Relaxation': return <Leaf {...iconProps} />;
      case 'Focus': return <Star {...iconProps} />;
      case 'Sleep': return <Moon {...iconProps} />;
      case 'Compassion': return <Heart {...iconProps} />;
      case 'Energy': return <Sun {...iconProps} />;
      case 'Anxiety': return <Mountain {...iconProps} />;
      case 'Stress': return <Sparkles {...iconProps} />;
      default: return <Compass {...iconProps} />;
    }
  };

  return {
    formatTime,
    getProgressColor,
    getDifficultyColor,
    getCategoryIcon
  };
};
