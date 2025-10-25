
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Target, Ban } from 'lucide-react';
import { FocusSession } from './types';

interface FocusSessionSummaryProps {
  session: FocusSession;
  onClose: () => void;
  onRestart: () => void;
}

export const FocusSessionSummary: React.FC<FocusSessionSummaryProps> = ({
  session,
  onClose,
  onRestart
}) => {
  const focusScore = session.focusScore || 0;
  const efficiency = session.duration ? Math.round((session.duration / 25) * 100) : 0;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excellent focus! 🎯';
    if (score >= 80) return 'Great job! 👍';
    if (score >= 70) return 'Good session! 😊';
    if (score >= 60) return 'Not bad, keep improving! 💪';
    return 'Room for improvement 📈';
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle>Session Complete!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Focus Score */}
        <div className="text-center space-y-2">
          <div className={`text-4xl font-bold ${getScoreColor(focusScore)}`}>
            {focusScore}/100
          </div>
          <p className="text-muted-foreground">{getScoreMessage(focusScore)}</p>
          <Progress value={focusScore} className="h-2" />
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Clock className="h-5 w-5 mx-auto mb-2 text-blue-500" />
            <div className="font-semibold">{session.duration}m</div>
            <div className="text-xs text-muted-foreground">Duration</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Ban className="h-5 w-5 mx-auto mb-2 text-red-500" />
            <div className="font-semibold">{session.distractionCount}</div>
            <div className="text-xs text-muted-foreground">Distractions</div>
          </div>
        </div>

        {/* Task Status */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <span className="font-medium">Task Completed</span>
          <Badge variant={session.taskCompleted ? "default" : "outline"}>
            {session.taskCompleted ? 'Yes' : 'No'}
          </Badge>
        </div>

        {/* Efficiency */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Time Efficiency</span>
            <span className="text-sm text-muted-foreground">{efficiency}%</span>
          </div>
          <Progress value={efficiency} className="h-2" />
        </div>

        {/* Session Notes */}
        {session.notes && (
          <div className="space-y-2">
            <h4 className="font-medium">Session Notes</h4>
            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              {session.notes}
            </div>
          </div>
        )}

        {/* Tags */}
        {session.tags && session.tags.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {session.tags.map((tag, index) => (
                <Badge key={index} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onRestart} className="flex-1">
            <Target className="h-4 w-4 mr-2" />
            Start New Session
          </Button>
          <Button onClick={onClose} className="flex-1">
            Done
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
