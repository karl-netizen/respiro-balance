
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Star, Target, Award, Zap } from 'lucide-react';
import { MorningRitual } from '@/context/types';

interface WeeklyPerformanceSummaryProps {
  rituals: MorningRitual[];
}

const WeeklyPerformanceSummary: React.FC<WeeklyPerformanceSummaryProps> = ({ rituals }) => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
  
  const formatDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };
  
  const weekDisplay = `${formatDate(startOfWeek)}-${formatDate(endOfWeek)}, ${today.getFullYear()}`;
  
  // Calculate enhanced daily completion rates for the week
  const dailyStats = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + i);
    
    const dayCompletions = rituals.filter(ritual => {
      if (!ritual.lastCompleted) return false;
      const completionDate = new Date(ritual.lastCompleted);
      return completionDate.toDateString() === currentDay.toDateString();
    }).length;
    
    const completionRate = rituals.length > 0 ? Math.round((dayCompletions / rituals.length) * 100) : 0;
    
    dailyStats.push({
      day: dayNames[i],
      fullDay: currentDay.toLocaleDateString('en-US', { weekday: 'long' }),
      date: currentDay.getDate(),
      completionRate,
      completedCount: dayCompletions,
      totalRituals: rituals.length,
      isPast: currentDay < today,
      isToday: currentDay.toDateString() === today.toDateString(),
      isFuture: currentDay > today
    });
  }
  
  // Calculate enhanced weekly metrics
  const validDays = dailyStats.filter(day => day.isPast || day.isToday);
  const weeklyCompletions = validDays.reduce((sum, day) => sum + day.completionRate, 0);
  const weeklyRate = validDays.length > 0 ? Math.round(weeklyCompletions / validDays.length) : 0;
  
  // Find peak performance day and streak information
  const peakDay = dailyStats.reduce((best, current) => 
    current.completionRate > best.completionRate ? current : best
  );
  
  const perfectDays = validDays.filter(day => day.completionRate === 100).length;
  const consistentDays = validDays.filter(day => day.completionRate >= 80).length;
  
  // Enhanced goal tracking status
  const getGoalStatus = () => {
    if (weeklyRate >= 95) return { 
      text: "Exceeding weekly goal", 
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: <Award className="h-4 w-4" />
    };
    if (weeklyRate >= 85) return { 
      text: "On track for weekly goal", 
      color: "bg-green-100 text-green-800 border-green-200",
      icon: <Target className="h-4 w-4" />
    };
    if (weeklyRate >= 70) return { 
      text: "Close to weekly goal", 
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: <TrendingUp className="h-4 w-4" />
    };
    if (weeklyRate >= 50) return { 
      text: "Behind weekly goal", 
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: <Zap className="h-4 w-4" />
    };
    return { 
      text: "Needs attention", 
      color: "bg-red-100 text-red-800 border-red-200",
      icon: <Target className="h-4 w-4" />
    };
  };
  
  const goalStatus = getGoalStatus();

  // Get day indicator styling
  const getDayIndicatorStyle = (day: any) => {
    if (day.isFuture) {
      return 'bg-gray-100 text-gray-400 border border-gray-200';
    }
    if (day.completionRate === 100) {
      return 'bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-md';
    }
    if (day.completionRate >= 80) {
      return 'bg-gradient-to-br from-green-500 to-lime-500 text-white shadow-md';
    }
    if (day.completionRate >= 60) {
      return 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-md';
    }
    if (day.completionRate >= 40) {
      return 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-md';
    }
    if (day.completionRate > 0) {
      return 'bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-md';
    }
    return 'bg-gray-300 text-gray-600 border border-gray-300';
  };

  return (
    <Card className="shadow-lg border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Calendar className="h-6 w-6 text-blue-500" />
              <span>Weekly Performance</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1 font-medium">{weekDisplay}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl px-4 py-2 shadow-md">
              {weeklyRate}%
            </Badge>
            {perfectDays > 0 && (
              <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-1">
                <Star className="h-3 w-3 mr-1" />
                {perfectDays} Perfect Day{perfectDays > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enhanced Daily Progress Indicators */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-700">Daily Progress</h4>
            <span className="text-sm text-gray-500">
              {consistentDays} of {validDays.length} consistent days (80%+)
            </span>
          </div>
          
          <div className="flex justify-between space-x-2">
            {dailyStats.map((day, index) => (
              <div key={index} className="flex-1 text-center">
                <div className="text-xs text-gray-600 mb-1 font-medium">{day.day}</div>
                <div className="text-xs text-gray-400 mb-2">{day.date}</div>
                <div 
                  className={`h-12 w-full rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all duration-300 hover:scale-105 ${getDayIndicatorStyle(day)} ${
                    day.isToday ? 'ring-2 ring-blue-400 ring-offset-2' : ''
                  }`}
                  title={day.isFuture ? 'Future day' : `${day.completedCount} of ${day.totalRituals} rituals completed`}
                >
                  {day.isFuture ? (
                    <span>—</span>
                  ) : (
                    <>
                      <span>{day.completionRate}%</span>
                      <span className="text-[10px] opacity-80">
                        {day.completedCount}/{day.totalRituals}
                      </span>
                    </>
                  )}
                </div>
                {day.isToday && (
                  <div className="text-[10px] text-blue-600 font-semibold mt-1">TODAY</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Performance Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-800">Peak Performance</span>
            </div>
            <p className="text-sm text-yellow-700">
              <span className="font-bold">{peakDay.fullDay}</span> ({peakDay.completionRate}%)
            </p>
            {peakDay.completionRate === 100 && (
              <p className="text-xs text-yellow-600">Perfect completion! 🎉</p>
            )}
          </div>
          
          <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              {goalStatus.icon}
              <span className="text-sm font-semibold text-blue-800">Goal Status</span>
            </div>
            <Badge className={goalStatus.color + " text-xs"}>
              {goalStatus.text}
            </Badge>
          </div>

          <div className="space-y-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-800">Consistency</span>
            </div>
            <p className="text-sm text-purple-700">
              <span className="font-bold">{Math.round((consistentDays / Math.max(validDays.length, 1)) * 100)}%</span> consistent days
            </p>
          </div>
        </div>

        {/* Enhanced Weekly Insights */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <Zap className="h-4 w-4 mr-2 text-blue-500" />
            Weekly Insights
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            {weeklyRate >= 90 && (
              <p className="flex items-start">
                <span className="mr-2">🎉</span>
                <span>Outstanding consistency! You're building incredibly strong habits.</span>
              </p>
            )}
            {perfectDays > 0 && (
              <p className="flex items-start">
                <span className="mr-2">⭐</span>
                <span>
                  {perfectDays === 1 ? 'One perfect day' : `${perfectDays} perfect days`} this week! 
                  Keep that momentum going.
                </span>
              </p>
            )}
            {validDays.length >= 5 && weeklyRate < 60 && (
              <p className="flex items-start">
                <span className="mr-2">💪</span>
                <span>Room for improvement. Try smaller, more achievable rituals to build momentum.</span>
              </p>
            )}
            {consistentDays >= 5 && (
              <p className="flex items-start">
                <span className="mr-2">🔥</span>
                <span>Excellent consistency! You're in the habit formation zone.</span>
              </p>
            )}
            <p className="flex items-start">
              <span className="mr-2">📊</span>
              <span>
                {validDays.length} days tracked this week with {rituals.length} total rituals. 
                Average completion: {weeklyRate}%
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyPerformanceSummary;
