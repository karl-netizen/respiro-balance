
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useFocus } from '@/context/FocusProvider';
import { FocusTimer } from './FocusTimer';
import { FocusControls } from './FocusControls';
import { FocusSessionSummary } from './FocusSessionSummary';
import { FocusSettingsDialog } from './FocusSettingsDialog';
import { BarChart3, Target, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FocusStats } from './FocusStats';
import { FocusHistory } from './FocusHistory';
import { FocusSession } from './types';

const FocusMode: React.FC = () => {
  const { 
    timerState, 
    startSession, 
    currentSession,
    stats
  } = useFocus();
  
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('timer');

  const renderContent = () => {
    if (timerState === 'completed') {
      // Convert the current session to match the expected FocusSession type
      const formattedSession: FocusSession = {
        id: currentSession?.id || '',
        userId: currentSession?.user_id || currentSession?.userId || '', 
        startTime: currentSession?.startTime ? currentSession.startTime.toString() : '',
        endTime: currentSession?.endTime ? currentSession.endTime.toString() : undefined,
        duration: currentSession?.duration,
        label: currentSession?.label || '',
        tags: currentSession?.tags || [],
        taskCompleted: !!currentSession?.completed,
        distractionCount: currentSession?.distractions || 0,
        focusScore: currentSession?.focusScore,
        notes: currentSession?.notes
      };
      
      return <FocusSessionSummary session={formattedSession} />;
    }
    
    return (
      <div className="space-y-6">
        <FocusTimer />
        <FocusControls />
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Focus Mode</CardTitle>
            <CardDescription>
              {timerState === 'idle' 
                ? 'Start a focused work session with timed breaks'
                : timerState === 'completed'
                ? 'Session completed'
                : timerState === 'paused'
                ? 'Session paused'
                : timerState === 'work'
                ? 'Focus time'
                : 'Break time'
              }
            </CardDescription>
          </div>
          
          <Button variant="outline" size="icon" onClick={() => setSettingsOpen(true)}>
            <Target className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="timer" className="p-0">
          <CardContent className="pt-6">
            {renderContent()}
          </CardContent>
          
          {timerState === 'idle' && (
            <CardFooter>
              <Button 
                className="w-full"
                onClick={startSession}
              >
                Start Focus Session
              </Button>
            </CardFooter>
          )}
        </TabsContent>
        
        <TabsContent value="stats" className="p-0">
          <CardContent className="pt-6">
            {stats && 
              <FocusStats stats={{
                ...stats,
                totalSessions: stats.totalSessions,
                totalMinutes: stats.totalMinutes,
                averageSessionLength: stats.averageSessionLength || 0,
                mostProductiveDay: stats.mostProductiveDay || 'N/A',
                mostProductiveTime: stats.mostProductiveTime || 'N/A',
                highestFocusScore: stats.highestFocusScore || 0,
                weeklyMinutes: stats.weeklyMinutes || [0,0,0,0,0,0,0],
                distractionRate: stats.distractionRate || 0,
                completionRate: stats.completionRate || 0,
                streak: stats.streak || 0
              }} />
            }
          </CardContent>
        </TabsContent>
        
        <TabsContent value="history" className="p-0">
          <CardContent className="pt-6">
            <FocusHistory />
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <FocusSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </Card>
  );
};

export default FocusMode;
