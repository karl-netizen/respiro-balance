
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Brain, Activity, TrendingUp } from "lucide-react";
import { UserPreferences } from "@/context/types";

interface InsightsSectionProps {
  preferences: UserPreferences;
}

const InsightsSection: React.FC<InsightsSectionProps> = ({ preferences }) => {
  // Generate personalized insights based on user preferences and patterns
  // This would ideally use AI or pattern matching to provide valuable recommendations
  
  const insights = [
    {
      title: "Best Time to Meditate",
      description: "Based on your activity patterns, meditating between 7-8am may improve your focus for the day.",
      icon: <Brain className="h-5 w-5 text-primary" />,
      action: "Try a morning meditation tomorrow"
    },
    {
      title: "Stress Reduction Pattern",
      description: "You show a 23% decrease in reported stress levels after guided breathing sessions.",
      icon: <Activity className="h-5 w-5 text-primary" />,
      action: "Schedule 3 breathing sessions this week"
    },
    {
      title: "Focus Improvement",
      description: "Sessions longer than 15 minutes correlate with better focus scores in your data.",
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
      action: "Increase session duration gradually"
    }
  ];
  
  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <div className="p-2 rounded-full bg-primary/10 mr-2">
                {insight.icon}
              </div>
              {insight.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{insight.description}</p>
            <div className="bg-secondary/40 p-3 rounded-md text-sm font-medium">
              Recommendation: {insight.action}
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress Snapshot</CardTitle>
          <CardDescription>
            Download or share your progress report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <button className="flex items-center justify-center w-full py-2 px-4 border border-primary/30 rounded-md hover:bg-primary/5 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download PDF Report
            </button>
            <button className="flex items-center justify-center w-full py-2 px-4 border border-primary/30 rounded-md hover:bg-primary/5 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              Share Progress
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsSection;
