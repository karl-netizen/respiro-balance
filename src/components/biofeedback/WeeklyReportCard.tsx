/**
 * Weekly Wellness Report Card
 */

import { useState } from 'react';
import { useBiofeedbackStore } from '@/store/biofeedbackStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock, 
  Target,
  Lightbulb
} from 'lucide-react';
import { format } from 'date-fns';

export function WeeklyReportCard() {
  const { weeklyReports, generateWeeklyReport } = useBiofeedbackStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const latestReport = weeklyReports[0];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      await generateWeeklyReport();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!latestReport) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Weekly Wellness Report
          </CardTitle>
          <CardDescription>
            Complete a few sessions to unlock your first report
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button 
            className="w-full" 
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Weekly Wellness Report
            </CardTitle>
            <CardDescription>
              {format(new Date(latestReport.weekStartDate), 'MMM d')} - {format(new Date(latestReport.weekEndDate), 'MMM d, yyyy')}
            </CardDescription>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="w-4 h-4" />
              <span className="text-sm">Sessions</span>
            </div>
            <p className="text-2xl font-bold">{latestReport.totalSessions}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Minutes</span>
            </div>
            <p className="text-2xl font-bold">{latestReport.totalMinutes}</p>
          </div>
        </div>

        {/* Week-over-Week Changes */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Week-over-Week Progress</h4>
          
          {/* Resting HR Change */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Resting HR</span>
            <div className="flex items-center gap-2">
              {latestReport.restingHRChange < 0 ? (
                <>
                  <TrendingDown className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">
                    {Math.abs(Math.round(latestReport.restingHRChange))} BPM
                  </span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-500">
                    +{Math.round(latestReport.restingHRChange)} BPM
                  </span>
                </>
              )}
            </div>
          </div>

          {/* HRV Improvement */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">HRV</span>
            <div className="flex items-center gap-2">
              {latestReport.hrvImprovement > 0 ? (
                <>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">
                    +{Math.round(latestReport.hrvImprovement)}%
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-500">
                    {Math.round(latestReport.hrvImprovement)}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Stress Reduction */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Stress</span>
            <div className="flex items-center gap-2">
              {latestReport.stressReduction > 0 ? (
                <>
                  <TrendingDown className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">
                    -{Math.round(latestReport.stressReduction)}%
                  </span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-orange-500">
                    +{Math.abs(Math.round(latestReport.stressReduction))}%
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Best Session */}
        {latestReport.bestSession && (
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Badge>⭐ Best Session</Badge>
            </div>
            <p className="text-sm">
              {latestReport.bestSession.sessionType.charAt(0).toUpperCase() + 
               latestReport.bestSession.sessionType.slice(1)} • {latestReport.bestSession.duration} min
            </p>
            <p className="text-xs text-muted-foreground">
              {latestReport.bestSession.insightText}
            </p>
          </div>
        )}

        {/* Recommendations */}
        {latestReport.recommendations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Lightbulb className="w-4 h-4" />
              Recommendations
            </div>
            <ul className="space-y-1">
              {latestReport.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
