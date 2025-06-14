
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Award } from 'lucide-react';
import { Achievement } from '@/hooks/useAchievements';
import { toast } from 'sonner';

interface AchievementNotificationProps {
  achievements: Achievement[];
  onDismiss: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievements,
  onDismiss
}) => {
  useEffect(() => {
    if (achievements.length > 0) {
      achievements.forEach(achievement => {
        toast.success(`🎉 Achievement Unlocked!`, {
          description: `${achievement.icon} ${achievement.title}: ${achievement.description}`,
          duration: 5000,
        });
      });
    }
  }, [achievements]);

  if (achievements.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {achievements.map(achievement => (
        <Card key={achievement.id} className="mb-2 border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-600" />
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                      Achievement Unlocked!
                    </h4>
                  </div>
                  <p className="font-medium text-sm">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDismiss}
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AchievementNotification;
