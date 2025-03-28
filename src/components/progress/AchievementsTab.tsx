
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface AchievementsTabProps {
  achievements: {
    name: string;
    description: string;
    unlocked: boolean;
  }[];
}

const AchievementsTab: React.FC<AchievementsTabProps> = ({ achievements }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {achievements.map((achievement, i) => (
        <Card key={i} className={!achievement.unlocked ? "opacity-60" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center">
              {achievement.unlocked ? (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mr-2">
                  <span className="text-foreground/50">?</span>
                </div>
              )}
              {achievement.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/70">
              {achievement.description}
            </p>
            {achievement.unlocked ? (
              <div className="mt-2 text-sm text-primary font-medium">Unlocked</div>
            ) : (
              <div className="mt-2 text-sm text-muted-foreground">Locked</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AchievementsTab;
