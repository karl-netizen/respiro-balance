
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Target, 
  TrendingUp, 
  Calendar,
  Flame,
  Award
} from 'lucide-react';
import { FadeIn, ScaleIn } from '@/components/animations/MicroInteractions';

interface Habit {
  id: string;
  name: string;
  completed: boolean;
  streak: number;
  target: number;
}

const DailyCheckIn: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Morning Meditation', completed: false, streak: 5, target: 10 },
    { id: '2', name: 'Breathing Exercise', completed: true, streak: 3, target: 5 },
    { id: '3', name: 'Mindful Break', completed: false, streak: 8, target: 15 }
  ]);

  const completedToday = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;
  const progressPercentage = (completedToday / totalHabits) * 100;

  const toggleHabit = (habitId: string) => {
    setHabits(habits.map(habit => 
      habit.id === habitId 
        ? { ...habit, completed: !habit.completed }
        : habit
    ));
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Daily Check-in
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Today's Progress</span>
                <Badge variant={progressPercentage === 100 ? "default" : "secondary"}>
                  {completedToday}/{totalHabits} completed
                </Badge>
              </div>
              
              <div className="space-y-3">
                {habits.map((habit, index) => (
                  <ScaleIn key={habit.id} delay={index * 100}>
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Button
                          variant={habit.completed ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleHabit(habit.id)}
                          className="h-8 w-8 p-0"
                        >
                          {habit.completed && <CheckCircle className="h-4 w-4" />}
                        </Button>
                        <div>
                          <p className="font-medium">{habit.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Flame className="h-3 w-3" />
                            <span>{habit.streak} day streak</span>
                            <Target className="h-3 w-3" />
                            <span>Goal: {habit.target} days</span>
                          </div>
                        </div>
                      </div>
                      
                      {habit.streak >= habit.target && (
                        <Award className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                  </ScaleIn>
                ))}
              </div>
              
              {progressPercentage === 100 && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium text-green-800">Fantastic! All habits completed today! 🎉</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
};

export default DailyCheckIn;
