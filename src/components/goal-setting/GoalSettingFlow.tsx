
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Target, Calendar, TrendingUp, CheckCircle } from 'lucide-react';
import { FadeIn, SlideIn } from '@/components/animations/MicroInteractions';
import { useUserPreferences } from '@/context';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'meditation' | 'wellness' | 'focus' | 'habit';
  target: number;
  unit: string;
  timeframe: 'daily' | 'weekly' | 'monthly';
  deadline?: string;
  progress: number;
  completed: boolean;
}

const GoalSettingFlow: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [isCreating, setIsCreating] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Daily Meditation',
      description: 'Meditate for 20 minutes every day',
      category: 'meditation',
      target: 20,
      unit: 'minutes',
      timeframe: 'daily',
      progress: 15,
      completed: false
    },
    {
      id: '2',
      title: 'Weekly Stress Reduction',
      description: 'Reduce average stress level to below 4',
      category: 'wellness',
      target: 4,
      unit: 'stress level',
      timeframe: 'weekly',
      progress: 5.2,
      completed: false
    }
  ]);

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'meditation' as Goal['category'],
    target: 0,
    unit: '',
    timeframe: 'daily' as Goal['timeframe'],
    deadline: ''
  });

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.target) return;

    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      progress: 0,
      completed: false
    };

    setGoals([...goals, goal]);
    setNewGoal({
      title: '',
      description: '',
      category: 'meditation',
      target: 0,
      unit: '',
      timeframe: 'daily',
      deadline: ''
    });
    setIsCreating(false);
  };

  const getCategoryColor = (category: Goal['category']) => {
    const colors = {
      meditation: 'bg-blue-100 text-blue-800',
      wellness: 'bg-green-100 text-green-800',
      focus: 'bg-purple-100 text-purple-800',
      habit: 'bg-orange-100 text-orange-800'
    };
    return colors[category];
  };

  const getProgressPercentage = (goal: Goal) => {
    if (goal.timeframe === 'daily') {
      return Math.min((goal.progress / goal.target) * 100, 100);
    }
    return Math.min((goal.progress / goal.target) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Your Goals</h2>
          </div>
          <Button onClick={() => setIsCreating(true)}>
            Create New Goal
          </Button>
        </div>
      </FadeIn>

      {/* Goal Creation Form */}
      {isCreating && (
        <SlideIn direction="down">
          <Card>
            <CardHeader>
              <CardTitle>Create New Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="e.g., Daily Meditation"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newGoal.category}
                    onValueChange={(value: Goal['category']) => 
                      setNewGoal({ ...newGoal, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meditation">Meditation</SelectItem>
                      <SelectItem value="wellness">Wellness</SelectItem>
                      <SelectItem value="focus">Focus</SelectItem>
                      <SelectItem value="habit">Habit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="Describe your goal in detail..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="target">Target</Label>
                  <Input
                    id="target"
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: Number(e.target.value) })}
                    placeholder="20"
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    placeholder="minutes"
                  />
                </div>
                <div>
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Select
                    value={newGoal.timeframe}
                    onValueChange={(value: Goal['timeframe']) => 
                      setNewGoal({ ...newGoal, timeframe: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateGoal}>
                  Create Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        </SlideIn>
      )}

      {/* Goals List */}
      <div className="grid gap-4">
        {goals.map((goal, index) => (
          <SlideIn key={goal.id} delay={index * 100}>
            <Card className={goal.completed ? 'border-green-200 bg-green-50' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">{goal.title}</h3>
                      {goal.completed && <CheckCircle className="h-5 w-5 text-green-600" />}
                      <Badge className={getCategoryColor(goal.category)}>
                        {goal.category}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{goal.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {goal.progress} / {goal.target} {goal.unit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(goal)}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getProgressPercentage(goal).toFixed(1)}% complete
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <Badge variant="outline">
                      {goal.timeframe}
                    </Badge>
                    {goal.deadline && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {goal.deadline}
                      </div>
                    )}
                  </div>
                </div>

                {!goal.completed && (
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Keep going! You're making great progress.
                    </div>
                    <Button size="sm" variant="outline">
                      Update Progress
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </SlideIn>
        ))}
      </div>

      {goals.length === 0 && !isCreating && (
        <FadeIn>
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No goals set yet</h3>
              <p className="text-muted-foreground mb-6">
                Set meaningful goals to track your mindfulness journey and stay motivated.
              </p>
              <Button onClick={() => setIsCreating(true)}>
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </div>
  );
};

export default GoalSettingFlow;
