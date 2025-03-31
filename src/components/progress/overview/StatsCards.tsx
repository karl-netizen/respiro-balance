
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Flame } from "lucide-react";

interface StatsCardsProps {
  meditationStats: {
    totalSessions: number;
    totalMinutes: number;
    streak: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ meditationStats }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            {meditationStats.totalSessions}
          </CardTitle>
          <CardDescription>Total Sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/70">
            You've completed {meditationStats.totalSessions} meditation sessions since you started.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl flex items-center">
            <Clock className="mr-2 h-5 w-5 text-primary" />
            {meditationStats.totalMinutes}
          </CardTitle>
          <CardDescription>Total Minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/70">
            You've spent {Math.floor(meditationStats.totalMinutes / 60)} hours and {meditationStats.totalMinutes % 60} minutes in meditation.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl flex items-center">
            <Flame className="mr-2 h-5 w-5 text-primary" />
            {meditationStats.streak}
          </CardTitle>
          <CardDescription>Current Streak</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/70">
            You've meditated {meditationStats.streak} days in a row. Keep it up!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
