
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Lightbulb, Clock, Calendar, ThumbsUp, AlarmCheck, BarChart } from "lucide-react";

interface InsightsSectionProps {
}

const InsightsSection: React.FC<InsightsSectionProps> = () => {
  // Sample insights based on meditation data
  const insights = [
    {
      title: "Best Time of Day",
      description: "Your morning sessions tend to be 30% longer and more consistent than other times of day.",
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      action: "Try to schedule more morning sessions for optimal results."
    },
    {
      title: "Weekend Consistency",
      description: "You're 60% more likely to meditate on weekends than weekdays.",
      icon: <Calendar className="h-5 w-5 text-purple-500" />,
      action: "Consider building a consistent weekday routine to improve your practice."
    },
    {
      title: "Technique Preference",
      description: "Guided meditations result in 25% higher completion rates for you than unguided sessions.",
      icon: <ThumbsUp className="h-5 w-5 text-green-500" />,
      action: "Stick with guided sessions while building your habit."
    },
    {
      title: "Session Length Sweet Spot",
      description: "Your optimal session length appears to be 12-15 minutes based on completion rates and feedback.",
      icon: <AlarmCheck className="h-5 w-5 text-red-500" />,
      action: "Try focusing on sessions in this range for best results."
    },
    {
      title: "Monthly Progress",
      description: "Your meditation minutes increased by 45% compared to last month.",
      icon: <BarChart className="h-5 w-5 text-amber-500" />,
      action: "Keep up the great momentum!"
    }
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
            Personalized Insights
          </CardTitle>
          <CardDescription>Discoveries from analyzing your meditation patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, i) => (
              <div key={i} className="bg-secondary/20 p-4 rounded-lg">
                <div className="flex items-start">
                  <div className="p-2 bg-background rounded-full mr-3">
                    {insight.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-base">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">{insight.description}</p>
                    <p className="text-sm font-medium">{insight.action}</p>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-center text-sm text-muted-foreground mt-6">
              <p>Continue your practice to unlock more personalized insights</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsSection;
