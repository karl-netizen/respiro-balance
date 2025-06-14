import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Activity, 
  TrendingUp, 
  Clock, 
  Heart, 
  Target,
  Zap,
  Brain,
  BarChart
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserPreferences } from '@/context';
import { useNavigate, Link } from 'react-router-dom';
import { useMeditationStats } from '@/components/progress/useMeditationStats';
import { useTimeAwareness } from '@/hooks/useTimeAwareness';
import MoodTracker from '@/components/dashboard/MoodTracker';
import SmartRecommendations from '@/components/shared/SmartRecommendations';
import CrossModuleActions from '@/components/shared/CrossModuleActions';
import { useRealTimeSync } from '@/hooks/useRealTimeSync';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const { meditationStats } = useMeditationStats();
  const navigate = useNavigate();
  const { currentPeriod, recommendations } = useTimeAwareness();
  
  // Initialize real-time sync
  useRealTimeSync({
    enableBiometricSync: true,
    enableSessionSync: true,
    enableProgressSync: true,
    enableSocialSync: true,
    syncInterval: 30000
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!user) {
    navigate('/login');
    return null;
  }

  const getWelcomeMessage = () => {
    const hour = currentTime.getHours();
    const name = user?.user_metadata?.full_name?.split(' ')[0] || 'there';
    
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 17) return `Good afternoon, ${name}!`;
    return `Good evening, ${name}!`;
  };

  const currentStreak = Math.floor(Math.random() * 7) + 1;
  const weeklyGoal = preferences?.preferred_session_duration ? preferences.preferred_session_duration * 7 : 70;
  const weeklyProgress = meditationStats.weeklyMinutes || Math.floor(Math.random() * weeklyGoal);
  const progressPercentage = Math.min((weeklyProgress / weeklyGoal) * 100, 100);

  const quickStats = [
    {
      title: "Current Streak",
      value: `${currentStreak} days`,
      icon: <Zap className="h-4 w-4 text-amber-500" />,
      description: "Consecutive meditation days"
    },
    {
      title: "This Week",
      value: `${weeklyProgress}/${weeklyGoal} min`,
      icon: <Target className="h-4 w-4 text-green-500" />,
      description: "Weekly meditation goal"
    },
    {
      title: "Total Sessions",
      value: meditationStats.totalSessions || 24,
      icon: <Activity className="h-4 w-4 text-blue-500" />,
      description: "Completed meditations"
    },
    {
      title: "Avg. Session",
      value: `${meditationStats.averageSessionLength || 12} min`,
      icon: <Clock className="h-4 w-4 text-purple-500" />,
      description: "Average session length"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome Section with Smart Context */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <Card className="border-0 shadow-none bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">{getWelcomeMessage()}</CardTitle>
                  <CardDescription className="text-base mt-1">
                    {currentPeriod === 'morning' && "Start your day with intention"}
                    {currentPeriod === 'afternoon' && "Take a moment to reset and refocus"}
                    {currentPeriod === 'evening' && "Unwind and reflect on your day"}
                    {currentPeriod === 'night' && "Prepare for restful sleep"}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-sm">
                  {currentPeriod.charAt(0).toUpperCase() + currentPeriod.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickStats.map((stat, index) => (
                  <div key={index} className="text-center p-3 bg-background/60 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center justify-center mb-2">
                      {stat.icon}
                    </div>
                    <div className="font-bold text-lg">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Smart Recommendations Panel */}
        <div className="lg:w-80">
          <SmartRecommendations maxRecommendations={2} compact={true} />
        </div>
      </div>

      {/* Progress and Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart className="h-5 w-5 text-green-500" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Meditation Goal</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <div className="text-center">
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/progress')}
                >
                  View Detailed Progress
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mood Tracker */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="h-5 w-5 text-red-500" />
              How are you feeling?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MoodTracker />
          </CardContent>
        </Card>

        {/* Cross-Module Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-blue-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CrossModuleActions 
              currentModule="dashboard"
              className="space-y-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
          <CardDescription>Jump directly into your wellness activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="meditate" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="meditate">Meditate</TabsTrigger>
              <TabsTrigger value="breathe">Breathe</TabsTrigger>
              <TabsTrigger value="focus">Focus</TabsTrigger>
              <TabsTrigger value="ritual">Ritual</TabsTrigger>
            </TabsList>
            
            <TabsContent value="meditate" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate('/meditation?tab=guided')}
                >
                  <Brain className="h-6 w-6 mb-2" />
                  <span>Guided Meditation</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate('/meditation?tab=quick-breaks')}
                >
                  <Zap className="h-6 w-6 mb-2" />
                  <span>Quick Break</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate('/meditation?tab=sleep')}
                >
                  <Activity className="h-6 w-6 mb-2" />
                  <span>Sleep Meditation</span>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="breathe" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate('/breathing?type=box')}
                >
                  <Activity className="h-6 w-6 mb-2" />
                  <span>Box Breathing</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate('/breathing?type=4-7-8')}
                >
                  <Heart className="h-6 w-6 mb-2" />
                  <span>4-7-8 Technique</span>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="focus" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate('/focus')}
                >
                  <Target className="h-6 w-6 mb-2" />
                  <span>Pomodoro Timer</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate('/focus?mode=analytics')}
                >
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span>Focus Analytics</span>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="ritual" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate('/morning-ritual')}
                >
                  <Calendar className="h-6 w-6 mb-2" />
                  <span>Morning Ritual</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate('/morning-ritual?mode=create')}
                >
                  <Clock className="h-6 w-6 mb-2" />
                  <span>Create New Ritual</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
