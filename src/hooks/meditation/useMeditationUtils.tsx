
import { Heart, Sparkles, Compass, Leaf, Mountain, Sun, Moon, Star } from 'lucide-react';

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
    const baseIconProps = { className: "h-5 w-5" };
    switch (category) {
      case 'Mindfulness': return <Compass {...baseIconProps} className="h-5 w-5 text-blue-500" />;
      case 'Relaxation': return <Leaf {...baseIconProps} className="h-5 w-5 text-green-500" />;
      case 'Focus': return <Star {...baseIconProps} className="h-5 w-5 text-purple-500" />;
      case 'Sleep': return <Moon {...baseIconProps} className="h-5 w-5 text-indigo-500" />;
      case 'Compassion': return <Heart {...baseIconProps} className="h-5 w-5 text-red-500" />;
      case 'Energy': return <Sun {...baseIconProps} className="h-5 w-5 text-yellow-500" />;
      case 'Anxiety': return <Mountain {...baseIconProps} className="h-5 w-5 text-gray-500" />;
      case 'Stress': return <Sparkles {...baseIconProps} className="h-5 w-5 text-pink-500" />;
      default: return <Compass {...baseIconProps} className="h-5 w-5 text-blue-500" />;
    }
  };

  return {
    formatTime,
    getProgressColor,
    getDifficultyColor,
    getCategoryIcon
  };
};
