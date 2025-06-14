
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Star } from 'lucide-react';
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
  
  // Calculate daily completion rates for the week
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
      date: currentDay.getDate(),
      completionRate,
      isPast: currentDay < today,
      isToday: currentDay.toDateString() === today.toDateString(),
      isFuture: currentDay > today
    });
  }
  
  // Calculate overall week completion rate
  const weeklyCompletions = dailyStats.filter(day => day.isPast || day.isToday).reduce((sum, day) => sum + day.completionRate, 0);
  const validDays = dailyStats.filter(day => day.isPast || day.isToday).length;
  const weeklyRate = validDays > 0 ? Math.round(weeklyCompletions / validDays) : 0;
  
  // Find peak performance day
  const peakDay = dailyStats.reduce((best, current) => 
    current.completionRate > best.completionRate ? current : best
  );
  
  // Goal tracking status
  const getGoalStatus = () => {
    if (weeklyRate >= 90) return { text: "Exceeding weekly goal", color: "bg-green-100 text-green-800" };
    if (weeklyRate >= 80) return { text: "On track for weekly goal", color: "bg-blue-100 text-blue-800" };
    if (weeklyRate >= 60) return { text: "Close to weekly goal", color: "bg-yellow-100 text-yellow-800" };
    return { text: "Behind weekly goal", color: "bg-red-100 text-red-800" };
  };
  
  const goalStatus = getGoalStatus();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Weekly Performance</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{weekDisplay}</p>
          </div>
          <Badge className="bg-blue-100 text-blue-800 text-lg px-3 py-1">
            {weeklyRate}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Daily Indicators */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">Daily Progress</h4>
          <div className="flex justify-between space-x-2">
            {dailyStats.map((day, index) => (
              <div key={index} className="flex-1 text-center">
                <div className="text-xs text-gray-500 mb-1">{day.day}</div>
                <div className="text-xs text-gray-400 mb-2">{day.date}</div>
                <div 
                  className={`h-8 w-full rounded-full flex items-center justify-center text-xs font-medium ${
                    day.isFuture ? 'bg-gray-100 text-gray-400' :
                    day.completionRate >= 90 ? 'bg-green-500 text-white' :
                    day.completionRate >= 70 ? 'bg-yellow-500 text-white' :
                    day.completionRate >= 50 ? 'bg-orange-500 text-white' :
                    day.completionRate > 0 ? 'bg-red-500 text-white' :
                    'bg-gray-300 text-gray-600'
                  } ${day.isToday ? 'ring-2 ring-blue-400' : ''}`}
                >
                  {day.isFuture ? '—' : `${day.completionRate}%`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Peak Performance</span>
            </div>
            <p className="text-sm text-gray-600">
              {peakDay.day} ({peakDay.completionRate}%)
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Goal Status</span>
            </div>
            <Badge className={goalStatus.color}>
              {goalStatus.text}
            </Badge>
          </div>
        </div>

        {/* Weekly Insights */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm text-gray-700 mb-2">Weekly Insights</h4>
          <div className="space-y-1 text-xs text-gray-600">
            {weeklyRate >= 80 && (
              <p>🎉 Excellent consistency! You're building strong habits.</p>
            )}
            {peakDay.completionRate === 100 && (
              <p>⭐ Perfect day on {peakDay.day}! Keep that momentum going.</p>
            )}
            {validDays >= 5 && weeklyRate < 60 && (
              <p>💪 Room for improvement. Try setting smaller, more achievable rituals.</p>
            )}
            <p>📊 {validDays} days tracked this week with {rituals.length} total rituals.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyPerformanceSummary;
