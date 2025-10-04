import { useMorningRitualsStore } from '@/store/morningRitualsStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Flame, Check } from 'lucide-react';

export default function MorningRitualsModule() {
  const { 
    habits, 
    currentStreak,
    toggleHabit,
    getTodayCompletions
  } = useMorningRitualsStore();

  const today = new Date().toISOString().split('T')[0];
  const todayCompletions = getTodayCompletions();
  const completedCount = todayCompletions.filter(c => c.completed).length;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <span>🌄</span> Morning Rituals
          </CardTitle>
          {currentStreak > 0 && (
            <Badge className="flex items-center gap-1">
              <Flame className="w-3 h-3" />
              {currentStreak} day streak
            </Badge>
          )}
        </div>
        <CardDescription>
          {completedCount}/{habits.length} completed today
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {habits.map(habit => {
          const completion = todayCompletions.find(c => c.habitId === habit.id);
          const isCompleted = completion?.completed || false;

          return (
            <div 
              key={habit.id}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
              onClick={() => toggleHabit(habit.id, today)}
            >
              <Checkbox checked={isCompleted} />
              <span className="text-2xl">{habit.icon}</span>
              <span className={`flex-1 ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                {habit.name}
              </span>
              {isCompleted && <Check className="w-4 h-4 text-green-500" />}
            </div>
          );
        })}

        {habits.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Add your first morning habit to get started
          </p>
        )}
      </CardContent>
    </Card>
  );
}
