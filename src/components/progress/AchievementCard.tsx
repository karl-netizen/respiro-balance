
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, AlertCircle } from "lucide-react";
import { Achievement } from '@/types/achievements';
import { cn } from '@/lib/utils';
import LucideIcon from '@/components/LucideIcon';

interface AchievementCardProps {
  achievement: Achievement;
  onClick?: () => void;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, onClick }) => {
  return (
    <Card 
      className={cn(
        "transition-all border cursor-pointer hover:shadow-md", 
        achievement.unlocked ? "bg-secondary/10" : "bg-background opacity-85"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div 
            className={cn(
              "p-2 rounded-full",
              achievement.unlocked ? "bg-primary/10" : "bg-gray-200 dark:bg-gray-800"
            )}
          >
            <LucideIcon
              name={achievement.icon} 
              className={cn(
                "h-5 w-5",
                achievement.unlocked ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>
          {achievement.unlocked && (
            <div className="bg-primary/10 rounded-full p-1">
              <Check className="text-primary h-3 w-3" />
            </div>
          )}
        </div>
        <CardTitle className={cn(
          "text-base mt-2",
          !achievement.unlocked && "text-muted-foreground"
        )}>
          {achievement.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3 min-h-[40px]">
          {achievement.description}
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>{achievement.progress}%</span>
          </div>
          <Progress value={achievement.progress} className="h-1.5" />
          {achievement.unlocked ? (
            <p className="text-xs text-primary">{achievement.unlockedDate}</p>
          ) : (
            <p className="text-xs text-muted-foreground flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {achievement.progress > 0 
                ? `${100 - achievement.progress}% remaining` 
                : "Not started yet"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementCard;
