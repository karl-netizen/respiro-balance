
import React from "react";
import { useUserPreferences } from "@/context";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Flame, Calendar, Award, TrendingUp } from "lucide-react";

const StreakTracker = () => {
  const { preferences } = useUserPreferences();
  const rituals = preferences.morningRituals || [];
  
  // Calculate current streak (max streak across all rituals)
  const currentStreak = rituals.reduce((max, ritual) => 
    ritual.streak > max ? ritual.streak : max, 0);
  
  // Count completed rituals
  const completedToday = rituals.filter(ritual => 
    ritual.status === "completed" && 
    new Date(ritual.lastCompleted || "").toDateString() === new Date().toDateString()
  ).length;
  
  // Calculate completion rate
  const totalRituals = rituals.length;
  const completionRate = totalRituals > 0 
    ? Math.round((completedToday / totalRituals) * 100) 
    : 0;
  
  // Generate past 7 days data for the mini chart
  const getDayLabel = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
  };
  
  const getStreakClass = (streak: number) => {
    if (streak >= 10) return "text-orange-500";
    if (streak >= 5) return "text-amber-500";
    return "text-slate-500";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-orange-50 to-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Flame className="h-5 w-5 mr-2 text-orange-500" /> 
            Current Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className={`text-4xl font-bold ${getStreakClass(currentStreak)}`}>
              {currentStreak}
            </div>
            <div className="ml-2 text-sm text-muted-foreground">days</div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {currentStreak === 0 
              ? "Start your streak today!" 
              : `Keep it going! You're doing great!`}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-500" /> 
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="text-4xl font-bold text-blue-500">
              {completedToday}
            </div>
            <div className="ml-2 text-sm text-muted-foreground">
              / {totalRituals} completed
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 mt-3">
            <div 
              className="bg-blue-500 h-2.5 rounded-full" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {completionRate}% of today's rituals completed
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Award className="h-5 w-5 mr-2 text-emerald-500" /> 
            Achievement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-lg font-medium">
            {currentStreak >= 10 ? (
              <span className="text-emerald-500">Morning Master</span>
            ) : currentStreak >= 5 ? (
              <span className="text-amber-500">Consistency Builder</span>
            ) : currentStreak > 0 ? (
              <span className="text-blue-500">Getting Started</span>
            ) : (
              <span className="text-slate-500">Begin Your Journey</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {currentStreak >= 10 
              ? "You've mastered your morning routine!" 
              : currentStreak >= 5
              ? "You're building excellent consistency!"
              : "Start building your morning ritual habit"}
          </p>
          <div className="flex items-center mt-3">
            <TrendingUp className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-xs text-muted-foreground">
              Next milestone: {currentStreak < 5 ? 5 : currentStreak < 10 ? 10 : 30} days
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StreakTracker;
