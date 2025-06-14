
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';

interface ScheduleOptimizationCardProps {
  scheduleOptimization: {
    conflicts: Array<{
      type: string;
      ritual1: string;
      ritual2?: string;
      suggestion: string;
    }>;
  };
  onOptimize: () => void;
}

const ScheduleOptimizationCard: React.FC<ScheduleOptimizationCardProps> = ({
  scheduleOptimization,
  onOptimize
}) => {
  if (!scheduleOptimization || scheduleOptimization.conflicts.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-orange-600" />
            Schedule Optimization
          </span>
          <Button onClick={onOptimize} size="sm">
            Auto-Optimize
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {scheduleOptimization.conflicts.slice(0, 3).map((conflict, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">
                {conflict.ritual1} {conflict.ritual2 && `& ${conflict.ritual2}`} - {conflict.suggestion}
              </span>
              <Badge variant="outline">{conflict.type}</Badge>
            </div>
          ))}
          {scheduleOptimization.conflicts.length > 3 && (
            <p className="text-sm text-muted-foreground">
              +{scheduleOptimization.conflicts.length - 3} more conflicts
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleOptimizationCard;
