
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Trophy, Star, Award } from 'lucide-react';
import { useEnhancedUXContext } from './EnhancedUXProvider';

export const AchievementToast: React.FC = () => {
  const { achievements, clearAchievements } = useEnhancedUXContext();

  useEffect(() => {
    achievements.forEach(achievement => {
      toast.success(`🎉 Achievement Unlocked!`, {
        description: `${achievement.icon} ${achievement.title}: ${achievement.description}`,
        duration: 6000,
        action: {
          label: "View All",
          onClick: () => {
            // Navigate to achievements page
            window.location.href = '/progress?tab=achievements';
          }
        }
      });
    });

    if (achievements.length > 0) {
      // Clear achievements after showing toasts
      setTimeout(clearAchievements, 1000);
    }
  }, [achievements, clearAchievements]);

  return null; // This component only handles side effects
};
