
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  Award, 
  Clock, 
  Sparkles, 
  Target, 
  Anchor, 
  Wind, 
  Brain, 
  Sunrise, 
  Footprints 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Achievement {
  name: string;
  description: string;
  unlocked: boolean;
  unlockedDate?: string;
  icon?: string;
}

interface AchievementsTabProps {
  achievements: Achievement[];
}

const AchievementsTab: React.FC<AchievementsTabProps> = ({ achievements }) => {
  // Count unlocked achievements for progress calculation
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercentage = (unlockedCount / totalCount) * 100;
  
  // Get the icon component based on the icon name
  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'award': return <Award />;
      case 'calendar': return <Calendar />;
      case 'target': return <Target />;
      case 'anchor': return <Anchor />;
      case 'wind': return <Wind />;
      case 'brain': return <Brain />;
      case 'sunrise': return <Sunrise />;
      case 'footprints': return <Footprints />;
      case 'clock': return <Clock />;
      default: return <Sparkles />;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Achievement Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Overall completion</span>
              <span>{unlockedCount}/{totalCount} achievements</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <h3 className="text-xl font-bold">{unlockedCount}</h3>
              <p className="text-sm text-muted-foreground">Unlocked</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-4 text-center">
              <h3 className="text-xl font-bold">{totalCount - unlockedCount}</h3>
              <p className="text-sm text-muted-foreground">Remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        {achievements.map((achievement, i) => (
          <Card 
            key={i} 
            className={!achievement.unlocked ? "opacity-60" : ""}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                {achievement.unlocked ? (
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-3 text-white">
                    {getIconComponent(achievement.icon)}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mr-3">
                    <span className="text-foreground/50">?</span>
                  </div>
                )}
                {achievement.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70 mb-2">
                {achievement.description}
              </p>
              {achievement.unlocked ? (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-primary font-medium flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    Unlocked
                  </div>
                  {achievement.unlockedDate && (
                    <div className="text-xs text-muted-foreground">
                      {achievement.unlockedDate}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Lock className="h-4 w-4 mr-1" />
                    Locked
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Keep meditating to unlock
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Lock icon component
const Lock = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export default AchievementsTab;
