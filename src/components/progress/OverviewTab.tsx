
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, Clock, Flame, Info, Activity, BarChart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import MeditationPlayer from "@/components/MeditationPlayer";

interface OverviewTabProps {
  meditationStats: {
    totalSessions: number;
    totalMinutes: number;
    streak: number;
    weeklyGoal: number;
    weeklyCompleted: number;
    lastSession: string;
    lastSessionDate: string;
  };
  sessions: {
    day: string;
    completed: boolean;
    today?: boolean;
  }[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ meditationStats, sessions }) => {
  return (
    <div className="mt-0">
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
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <WeeklyProgressCard meditationStats={meditationStats} sessions={sessions} />
          
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4">Continue Your Practice</h3>
            <MeditationPlayer />
          </div>
        </div>
        
        <div>
          <LastSessionCard 
            lastSession={meditationStats.lastSession} 
            lastSessionDate={meditationStats.lastSessionDate} 
          />
          
          <RecommendationsCard />
        </div>
      </div>
    </div>
  );
};

const WeeklyProgressCard: React.FC<{
  meditationStats: {
    weeklyGoal: number;
    weeklyCompleted: number;
  };
  sessions: {
    day: string;
    completed: boolean;
    today?: boolean;
  }[];
}> = ({ meditationStats, sessions }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Weekly Progress</CardTitle>
            <CardDescription>
              Your meditation activity this week
            </CardDescription>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">About Weekly Progress</h4>
                <p className="text-sm">
                  This shows your weekly meditation sessions. You've set a goal of {meditationStats.weeklyGoal} sessions per week.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 justify-between mb-4">
          {sessions.map((session, i) => (
            <div 
              key={i} 
              className={`flex flex-col items-center ${session.today ? 'relative' : ''}`}
            >
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-1
                  ${session.completed 
                    ? 'bg-primary text-white' 
                    : session.today 
                      ? 'border-2 border-primary text-primary' 
                      : 'bg-secondary/50 text-foreground/50'
                  }`}
              >
                {session.completed ? '✓' : ''}
              </div>
              <span className={`text-xs ${session.today ? 'font-bold' : ''}`}>{session.day}</span>
              {session.today && (
                <div className="absolute -top-2 -right-2 text-xs bg-primary text-white rounded-full px-1">
                  Today
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Weekly goal progress</span>
            <span>{meditationStats.weeklyCompleted}/{meditationStats.weeklyGoal} sessions</span>
          </div>
          <Progress value={(meditationStats.weeklyCompleted / meditationStats.weeklyGoal) * 100} />
        </div>
      </CardContent>
    </Card>
  );
};

const LastSessionCard: React.FC<{
  lastSession: string;
  lastSessionDate: string;
}> = ({ lastSession, lastSessionDate }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Last Session</CardTitle>
        <CardDescription>
          {lastSessionDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="bg-primary/10 p-4 rounded-md">
            <h4 className="font-medium">{lastSession}</h4>
            <p className="text-sm text-foreground/70 mt-1">
              15 minute guided meditation
            </p>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="flex items-center">
              <Activity className="h-4 w-4 mr-1 text-primary" />
              Focus increase
            </span>
            <span>+12%</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="flex items-center">
              <BarChart className="h-4 w-4 mr-1 text-primary" />
              Stress reduction
            </span>
            <span>-15%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RecommendationsCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
        <CardDescription>
          Based on your progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          <li className="bg-secondary/40 p-3 rounded flex items-start">
            <div className="p-1 rounded-full bg-primary/20 mr-2 mt-0.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="text-sm">
              Try a <span className="font-medium">focus meditation</span> tomorrow morning to improve your workday concentration.
            </div>
          </li>
          <li className="bg-secondary/40 p-3 rounded flex items-start">
            <div className="p-1 rounded-full bg-primary/20 mr-2 mt-0.5">
              <Activity className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="text-sm">
              Increase your meditation duration gradually to <span className="font-medium">15 minutes</span> for deeper benefits.
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default OverviewTab;
