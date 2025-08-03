import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Play } from 'lucide-react';
import { FocusTimer } from './FocusTimer';
import { FocusControls } from './FocusControls';

interface FocusTimerTabProps {
  timerState: string;
  remaining: number;
  onStartSession: () => void;
}

export const FocusTimerTab: React.FC<FocusTimerTabProps> = ({
  timerState,
  remaining,
  onStartSession
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isActive = timerState !== 'idle' && timerState !== 'completed';

  const getTimerMessage = () => {
    switch (timerState) {
      case 'idle': return 'Ready to start your focus session';
      case 'work': return 'Focus time - Stay concentrated!';
      case 'break': return 'Break time - Rest and recharge';
      case 'long-break': return 'Long break - Take a longer rest';
      case 'paused': return 'Session paused';
      case 'completed': return 'Session completed!';
      default: return '';
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            Focus Mode Timer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className="text-6xl font-mono font-bold mb-4">
              {formatTime(remaining || 1500)}
            </div>
            <p className="text-muted-foreground">
              {getTimerMessage()}
            </p>
          </div>

          {/* Start Session Button when idle */}
          {timerState === 'idle' && (
            <div className="text-center">
              <Button 
                onClick={onStartSession}
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Focus Session
              </Button>
            </div>
          )}

          {/* Focus Controls when active */}
          {isActive && <FocusControls />}

          {/* Original Focus Timer Component */}
          <div className="mt-6">
            <FocusTimer />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};