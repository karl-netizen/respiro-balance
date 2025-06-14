
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Pause } from 'lucide-react';
import { SessionFlow } from '@/context/types';

interface SessionFlowWidgetProps {
  sessionFlow: SessionFlow;
  onPause?: () => void;
  onResume?: () => void;
}

const SessionFlowWidget: React.FC<SessionFlowWidgetProps> = ({
  sessionFlow,
  onPause,
  onResume
}) => {
  const progress = sessionFlow.currentStep && sessionFlow.totalSteps ? 
    (sessionFlow.currentStep / sessionFlow.totalSteps) * 100 : 0;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Session Progress</CardTitle>
          <Badge variant={sessionFlow.status === 'in_progress' ? 'default' : 'secondary'}>
            {sessionFlow.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Step {sessionFlow.currentStep || 0} of {sessionFlow.totalSteps || 0}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>~{sessionFlow.estimatedDuration || 0} min remaining</span>
          </div>
          
          <div className="flex gap-2">
            {sessionFlow.status === 'in_progress' && onPause && (
              <button onClick={onPause} className="flex items-center gap-1 hover:text-foreground">
                <Pause className="h-4 w-4" />
                Pause
              </button>
            )}
            
            {sessionFlow.status === 'paused' && onResume && (
              <button onClick={onResume} className="flex items-center gap-1 hover:text-foreground">
                <Play className="h-4 w-4" />
                Resume
              </button>
            )}
          </div>
        </div>

        {sessionFlow.currentModule && (
          <div className="text-sm">
            <span className="text-muted-foreground">Current: </span>
            <span className="font-medium">{sessionFlow.currentModule}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionFlowWidget;
