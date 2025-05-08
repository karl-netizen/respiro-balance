
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
      return <FocusSessionSummary session={currentSession} />;
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
            <FocusStats stats={stats} />
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
