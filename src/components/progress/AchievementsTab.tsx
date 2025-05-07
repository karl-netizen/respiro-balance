
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Star, Clock, Calendar, Target, Award, Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Import the type from types file
import { Achievement } from '@/types/achievements';

interface AchievementsTabProps {
  achievements: Achievement[];
}

const AchievementsTab: React.FC<AchievementsTabProps> = ({ achievements }) => {
  // Sort achievements: unlocked first, then by progress
  const sortedAchievements = [...achievements].sort((a, b) => {
    if (a.unlocked === b.unlocked) {
      return (b.progress || 0) - (a.progress || 0);
    }
    return a.unlocked ? -1 : 1;
  });
  
  // Function to get the right icon for an achievement
  const getAchievementIcon = (iconName: string | undefined) => {
    switch (iconName) {
      case 'trophy': return <Trophy className="h-6 w-6" />;
      case 'star': return <Star className="h-6 w-6" />;
      case 'clock': return <Clock className="h-6 w-6" />;
      case 'calendar': return <Calendar className="h-6 w-6" />;
      case 'target': return <Target className="h-6 w-6" />;
      case 'flame': return <Flame className="h-6 w-6" />;
      default: return <Award className="h-6 w-6" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Meditation Achievements</CardTitle>
          <CardDescription>
            Track your progress and earn badges as you develop your meditation practice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedAchievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`p-4 rounded-lg border ${
                  achievement.unlocked 
                    ? 'bg-primary/10 border-primary/30' 
                    : 'bg-muted/30 border-muted'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full ${
                    achievement.unlocked ? 'bg-primary/20' : 'bg-muted'
                  }`}>
                    {getAchievementIcon(achievement.icon)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress || 0}%</span>
                      </div>
                      <Progress value={achievement.progress || 0} className="h-1.5" />
                    </div>
                    
                    {achievement.unlocked && achievement.unlockedDate && (
                      <p className="text-xs text-primary mt-2">
                        Unlocked on {new Date(achievement.unlockedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementsTab;
