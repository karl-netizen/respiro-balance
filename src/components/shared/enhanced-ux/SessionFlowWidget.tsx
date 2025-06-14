
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, Target } from 'lucide-react';
import { useEnhancedUXContext } from './EnhancedUXProvider';

export const SessionFlowWidget: React.FC = () => {
  const { activeSessionFlow, transitionToModule, completeSessionFlow } = useEnhancedUXContext();

  if (!activeSessionFlow) return null;

  const progressPercentage = (activeSessionFlow.currentStep / activeSessionFlow.totalSteps) * 100;
  const remainingModules = activeSessionFlow.modules.slice(activeSessionFlow.currentStep + 1);

  return (
    <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Active Session Flow
          </CardTitle>
          <Badge variant="outline" className="text-blue-600">
            {activeSessionFlow.currentStep + 1} of {activeSessionFlow.totalSteps}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              ~{activeSessionFlow.estimatedDuration} min total
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Current: {activeSessionFlow.currentModule}</div>
          {remainingModules.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Next: {remainingModules.join(' → ')}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {remainingModules.length > 0 ? (
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => transitionToModule(remainingModules[0], activeSessionFlow.currentModule, {})}
            >
              Continue to {remainingModules[0]}
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => completeSessionFlow({})}
            >
              Complete Flow
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => completeSessionFlow({})}
          >
            End Early
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
