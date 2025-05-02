
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartLine } from 'lucide-react';
import { useMeditationFeedback } from '@/hooks/useMeditationFeedback';
import { Progress } from '@/components/ui/progress';

interface MeditationInsightCardProps {
  title?: string;
  description?: string;
}

const MeditationInsightCard: React.FC<MeditationInsightCardProps> = ({ 
  title = "Meditation Insights",
  description = "Based on your feedback and activity"
}) => {
  const { getFeedbackInsights } = useMeditationFeedback();
  
  const insights = getFeedbackInsights();
  
  if (!insights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-muted-foreground">
            Submit feedback after meditation sessions to see insights here.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <ChartLine className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.avgFocusImprovement !== undefined && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Focus Improvement</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(insights.avgFocusImprovement * 10) / 10}%
                </span>
              </div>
              <Progress value={insights.avgFocusImprovement} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Average improvement in focus after meditation sessions
              </p>
            </div>
          )}
          
          {insights.avgStressReduction !== undefined && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Stress Reduction</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(insights.avgStressReduction * 10) / 10}%
                </span>
              </div>
              <Progress value={insights.avgStressReduction} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Average reduction in stress after meditation sessions
              </p>
            </div>
          )}
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Rating</span>
              <span className="text-sm text-muted-foreground">
                {insights.averageRating.toFixed(1)}/5
              </span>
            </div>
            <Progress value={insights.averageRating * 20} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Based on {insights.totalFeedbacks} session ratings
            </p>
          </div>
          
          {insights.recommendRate !== undefined && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Would Recommend</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(insights.recommendRate * 100)}%
                </span>
              </div>
              <Progress value={insights.recommendRate * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Percentage of users who would recommend these sessions
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationInsightCard;
