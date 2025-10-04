/**
 * Session Insight Dialog
 * Shows biofeedback insights after meditation sessions
 */

import { useEffect, useState } from 'react';
import { useBiofeedbackStore } from '@/store/biofeedbackStore';
import { SessionInsight } from '@/lib/biofeedback/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, Heart, Activity, Brain, Sparkles } from 'lucide-react';

interface SessionInsightDialogProps {
  open: boolean;
  onClose: () => void;
  sessionId: string;
  sessionType: 'meditation' | 'breathing' | 'focus';
  duration: number;
}

export function SessionInsightDialog({
  open,
  onClose,
  sessionId,
  sessionType,
  duration
}: SessionInsightDialogProps) {
  const { isConnected, captureSessionInsight } = useBiofeedbackStore();
  const [insight, setInsight] = useState<SessionInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && isConnected && !insight) {
      setIsLoading(true);
      captureSessionInsight(sessionId, sessionType, duration)
        .then(setInsight)
        .finally(() => setIsLoading(false));
    }
  }, [open, isConnected, sessionId, sessionType, duration, insight, captureSessionInsight]);

  if (!isConnected) {
    return null; // Don't show if biofeedback not connected
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Session Complete!
          </DialogTitle>
          <DialogDescription>
            Here's how this session impacted your wellness
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Analyzing your wellness data...
            </p>
          </div>
        )}

        {insight && !isLoading && (
          <div className="space-y-4">
            {/* Impact Rating */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <Badge 
                    variant={
                      insight.impactRating === 'excellent' ? 'default' :
                      insight.impactRating === 'high' ? 'default' :
                      'secondary'
                    }
                    className="text-lg px-4 py-1"
                  >
                    {insight.impactRating.charAt(0).toUpperCase() + insight.impactRating.slice(1)} Impact
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {insight.insightText}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Metrics Changes */}
            <div className="grid grid-cols-3 gap-3">
              {/* Heart Rate Change */}
              {insight.hrChange !== null && (
                <Card>
                  <CardContent className="pt-4 pb-3 text-center">
                    <Heart className="w-5 h-5 mx-auto mb-2 text-red-500" />
                    <div className="text-xl font-bold flex items-center justify-center gap-1">
                      {insight.hrChange < 0 ? (
                        <TrendingDown className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-red-500" />
                      )}
                      {Math.abs(Math.round(insight.hrChange))}
                    </div>
                    <p className="text-xs text-muted-foreground">BPM</p>
                  </CardContent>
                </Card>
              )}

              {/* HRV Change */}
              {insight.hrvChange !== null && (
                <Card>
                  <CardContent className="pt-4 pb-3 text-center">
                    <Activity className="w-5 h-5 mx-auto mb-2 text-blue-500" />
                    <div className="text-xl font-bold flex items-center justify-center gap-1">
                      {insight.hrvChange > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      {Math.abs(Math.round(insight.hrvChange))}%
                    </div>
                    <p className="text-xs text-muted-foreground">HRV</p>
                  </CardContent>
                </Card>
              )}

              {/* Stress Reduction */}
              {insight.stressReduction !== null && (
                <Card>
                  <CardContent className="pt-4 pb-3 text-center">
                    <Brain className="w-5 h-5 mx-auto mb-2 text-purple-500" />
                    <div className="text-xl font-bold flex items-center justify-center gap-1">
                      <TrendingDown className="w-4 h-4 text-green-500" />
                      {Math.round(insight.stressReduction)}%
                    </div>
                    <p className="text-xs text-muted-foreground">Stress</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Call to Action */}
            <div className="pt-2">
              <Button className="w-full" onClick={onClose}>
                Continue
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
