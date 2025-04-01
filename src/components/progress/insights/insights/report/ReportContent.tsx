
import React from 'react';
import { MeditationStats } from '@/components/progress/types/meditationStats';
import { Brain, Activity, TrendingUp, Moon, Sun, Clock } from "lucide-react";

interface ReportContentProps {
  meditationStats: MeditationStats;
  userName: string;
}

const ReportContent: React.FC<ReportContentProps> = ({ meditationStats, userName }) => {
  const today = new Date().toLocaleDateString();
  
  // Helper function to get personalized insights
  const getPersonalizedInsights = () => {
    const insights = [];
    
    // Best time insight
    insights.push({
      title: "Best Time to Meditate",
      description: "Based on your patterns, your optimal meditation time is in the morning (7-8am).",
      icon: <Brain className="h-5 w-5 text-primary" />,
      category: "Timing"
    });
    
    // Consistency insight
    if (meditationStats.weeklyCompleted > 0) {
      const consistencyRate = (meditationStats.weeklyCompleted / meditationStats.weeklyGoal) * 100;
      
      if (consistencyRate < 50) {
        insights.push({
          title: "Consistency Opportunity",
          description: `You're currently at ${Math.round(consistencyRate)}% of your weekly goal. Small increases can lead to bigger benefits.`,
          icon: <Clock className="h-5 w-5 text-primary" />,
          category: "Consistency"
        });
      } else {
        insights.push({
          title: "Consistency Champion",
          description: `Great job maintaining ${Math.round(consistencyRate)}% of your weekly meditation goal!`,
          icon: <Activity className="h-5 w-5 text-primary" />,
          category: "Consistency"
        });
      }
    }
    
    // Focus improvement insight
    insights.push({
      title: "Focus Improvement",
      description: "Your sessions longer than 15 minutes correlate with better focus scores.",
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
      category: "Focus"
    });
    
    return insights;
  };
  
  const personalizedInsights = getPersonalizedInsights();
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm" style={{ width: '800px', minHeight: '600px' }}>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-primary">Meditation Progress Report</h1>
        <div className="text-sm text-muted-foreground">Generated on: {today}</div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">User: {userName}</h2>
        <p className="text-muted-foreground">Summary of your meditation journey</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-secondary/30 p-4 rounded-md">
          <h3 className="font-medium text-sm text-muted-foreground">Total Sessions</h3>
          <p className="text-2xl font-bold">{meditationStats.totalSessions}</p>
        </div>
        <div className="bg-secondary/30 p-4 rounded-md">
          <h3 className="font-medium text-sm text-muted-foreground">Total Minutes</h3>
          <p className="text-2xl font-bold">{meditationStats.totalMinutes}</p>
        </div>
        <div className="bg-secondary/30 p-4 rounded-md">
          <h3 className="font-medium text-sm text-muted-foreground">Current Streak</h3>
          <p className="text-2xl font-bold">{meditationStats.streak} days</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Your Meditation Patterns</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/20 p-4 rounded-md">
            <h4 className="font-medium text-sm mb-2">Weekly Goal Progress</h4>
            <div className="flex items-end gap-2">
              <div className="text-2xl font-bold">{meditationStats.weeklyCompleted}/{meditationStats.weeklyGoal}</div>
              <div className="text-sm text-muted-foreground">sessions completed</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${(meditationStats.weeklyCompleted / meditationStats.weeklyGoal) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-secondary/20 p-4 rounded-md">
            <h4 className="font-medium text-sm mb-2">Consistency Score</h4>
            <div className="text-2xl font-bold">{Math.round((meditationStats.streak / 7) * 100)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Based on your current streak</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Personalized Insights</h3>
        <div className="space-y-3">
          {personalizedInsights.map((insight, i) => (
            <div key={i} className="flex items-start p-3 bg-secondary/20 rounded-md">
              <div className="mr-3 p-2 bg-primary/10 rounded-full shrink-0">
                {insight.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{insight.title}</h4>
                  <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-full">
                    {insight.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Focus & Stress Correlation</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/30 p-4 rounded-md">
            <h4 className="font-medium text-sm mb-1">Focus Score with Meditation</h4>
            <p className="text-2xl font-bold">{meditationStats.focusCorrelation.withMeditation}%</p>
            <p className="text-xs text-muted-foreground mt-1">vs. {meditationStats.focusCorrelation.withoutMeditation}% without meditation</p>
          </div>
          <div className="bg-secondary/30 p-4 rounded-md">
            <h4 className="font-medium text-sm mb-1">Stress Level Reduction</h4>
            <p className="text-2xl font-bold">
              {meditationStats.moodCorrelation.withMeditation - meditationStats.moodCorrelation.withoutMeditation}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">Average improvement after sessions</p>
          </div>
        </div>
      </div>
      
      <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
        <p>Generated by MindfulMe Meditation App</p>
      </div>
    </div>
  );
};

export default ReportContent;
