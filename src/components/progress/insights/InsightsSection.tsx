
import React from 'react';
import { Brain, Activity, TrendingUp } from "lucide-react";
import { UserPreferences } from "@/context/types";
import { InsightCard, ProgressReportCard } from './insights';

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
        <InsightCard 
          key={index}
          title={insight.title}
          description={insight.description}
          icon={insight.icon}
          action={insight.action}
        />
      ))}
      
      <ProgressReportCard />
    </div>
  );
};

export default InsightsSection;
