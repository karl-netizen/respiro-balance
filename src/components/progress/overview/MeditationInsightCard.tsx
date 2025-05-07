
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const MeditationInsightCard: React.FC = () => {
  // Array of possible insights
  const insights = [
    {
      title: "Morning Meditation",
      description: "Your morning sessions tend to be more effective. Consider scheduling more sessions in the morning for better results.",
      icon: <Lightbulb className="h-5 w-5 text-yellow-500" />
    },
    {
      title: "Consistency Pays Off",
      description: "Users who meditate at least 4 times per week report 30% higher satisfaction with their meditation practice.",
      icon: <Lightbulb className="h-5 w-5 text-yellow-500" />
    },
    {
      title: "Optimal Session Length",
      description: "Your focus scores are highest in 15-minute sessions. This might be your sweet spot for meditation.",
      icon: <Lightbulb className="h-5 w-5 text-yellow-500" />
    },
    {
      title: "Weekend Warriors",
      description: "You tend to meditate more consistently on weekends. Try building habits during weekdays too.",
      icon: <Lightbulb className="h-5 w-5 text-yellow-500" />
    }
  ];
  
  // Select a random insight
  const randomInsight = insights[Math.floor(Math.random() * insights.length)];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          {randomInsight.icon}
          <span className="ml-2">{randomInsight.title}</span>
        </CardTitle>
        <CardDescription>Based on your meditation patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          {randomInsight.description}
        </p>
        
        <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
          <p>Continue your practice to unlock more personalized insights.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationInsightCard;
