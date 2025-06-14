
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Calendar, TrendingUp } from 'lucide-react';
import { MeditationSession } from '@/types/meditation';

interface MeditationProgressTrackerProps {
  sessions: MeditationSession[];
}

const MeditationProgressTracker: React.FC<MeditationProgressTrackerProps> = ({ sessions }) => {
  // Calculate basic stats from sessions
  const completedSessions = sessions.filter(s => s.completed).length;
  const totalMinutes = sessions.reduce((acc, s) => acc + (s.completed ? s.duration : 0), 0);
  const currentStreak = 7; // Mock data - in real app this would be calculated
  const weeklyGoal = 150; // 150 minutes per week
  const weeklyProgress = Math.min((totalMinutes % 1000) / weeklyGoal * 100, 100); // Mock calculation

  const achievements = [
    { id: 1, name: 'First Session', completed: completedSessions >= 1, icon: Trophy },
    { id: 2, name: 'Week Warrior', completed: currentStreak >= 7, icon: Calendar },
    { id: 3, name: 'Mindful Master', completed: completedSessions >= 50, icon: Target },
    { id: 4, name: 'Zen Zone', completed: totalMinutes >= 1000, icon: TrendingUp },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Progress Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Weekly Goal Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Weekly Goal</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(weeklyProgress)}%
            </span>
          </div>
          <Progress value={weeklyProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round(totalMinutes % 1000)} / {weeklyGoal} minutes this week
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{completedSessions}</div>
            <div className="text-xs text-muted-foreground">Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{totalMinutes}</div>
            <div className="text-xs text-muted-foreground">Minutes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{currentStreak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{achievements.filter(a => a.completed).length}</div>
            <div className="text-xs text-muted-foreground">Achievements</div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div>
          <h4 className="text-sm font-medium mb-3">Recent Achievements</h4>
          <div className="space-y-2">
            {achievements.slice(0, 3).map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`flex items-center space-x-2 p-2 rounded ${
                    achievement.completed 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-sm">{achievement.name}</span>
                  {achievement.completed && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Unlocked
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Milestone */}
        <div className="bg-muted/50 p-3 rounded">
          <h4 className="text-sm font-medium mb-1">Next Milestone</h4>
          <p className="text-xs text-muted-foreground">
            Complete {Math.max(0, 50 - completedSessions)} more sessions to unlock "Mindful Master"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationProgressTracker;
