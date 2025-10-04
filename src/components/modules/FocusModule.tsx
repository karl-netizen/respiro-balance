import { useEffect, useState } from 'react';
import { useFocusModeStore } from '@/store/focusModeStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, Target, Clock } from 'lucide-react';

export default function FocusModule() {
  const {
    isActive,
    currentSession,
    timeRemaining,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    skipSession,
    getTodayStats
  } = useFocusModeStore();

  const [displayTime, setDisplayTime] = useState(timeRemaining);
  const todayStats = getTodayStats();

  // Timer countdown
  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        useFocusModeStore.setState((state) => ({
          timeRemaining: Math.max(0, state.timeRemaining - 1)
        }));
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeRemaining === 0 && currentSession) {
      completeSession();
    }
  }, [isActive, timeRemaining, currentSession, completeSession]);

  useEffect(() => {
    setDisplayTime(timeRemaining);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionLabel = (type: string) => {
    if (type === 'work') return 'Focus Session';
    if (type === 'short_break') return 'Short Break';
    return 'Long Break';
  };

  // No active session
  if (!currentSession) {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <span>🎯</span> Focus Mode
          </CardTitle>
          <CardDescription>
            Boost productivity with Pomodoro technique
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Today's Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Today</span>
              </div>
              <p className="text-2xl font-bold">{todayStats.totalMinutes} min</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Target className="w-4 h-4" />
                <span className="text-sm">Sessions</span>
              </div>
              <p className="text-2xl font-bold">{todayStats.sessionsCompleted}</p>
            </div>
          </div>

          {/* Start Button */}
          <Button 
            className="w-full" 
            onClick={() => startSession('work')}
            size="lg"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Focus Session
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            25 minutes of focused work
          </p>
        </CardContent>
      </Card>
    );
  }

  // Active session
  const progress = ((currentSession.duration * 60 - timeRemaining) / (currentSession.duration * 60)) * 100;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <span>🎯</span> Focus Mode
          </CardTitle>
          <Badge>{getSessionLabel(currentSession.type)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">
            {formatTime(displayTime)}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {isActive ? (
            <Button 
              variant="outline" 
              onClick={pauseSession}
              className="flex-1"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          ) : (
            <Button 
              onClick={resumeSession}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              Resume
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={skipSession}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="text-center text-sm text-muted-foreground">
          Today: {todayStats.sessionsCompleted} sessions • {todayStats.totalMinutes} min
        </div>
      </CardContent>
    </Card>
  );
}
