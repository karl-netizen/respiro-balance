import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, CheckCircle, Clock, Target, Calendar, Trophy, Zap } from 'lucide-react';
import { MorningRitual } from '@/context/types';
import { wasCompletedToday } from './utils';

interface DailyStatusDashboardProps {
  rituals: MorningRitual[];
  onCompleteRemaining: () => void;
}

const DailyStatusDashboard: React.FC<DailyStatusDashboardProps> = ({
  rituals,
  onCompleteRemaining
}) => {
  const today = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const todayFormatted = `${dayNames[today.getDay()]}, ${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
  
  // Calculate completion stats
  const completedToday = rituals.filter(ritual => 
    ritual.status === 'completed' && wasCompletedToday(ritual.lastCompleted)
  ).length;
  
  const totalRituals = rituals.length;
  const completionPercentage = totalRituals > 0 ? Math.round((completedToday / totalRituals) * 100) : 0;
  
  // Calculate overall streak (days with 80%+ completion)
  const overallStreak = calculateOverallStreak(rituals);
  
  const getMotivationalMessage = () => {
    const currentHour = today.getHours();
    const isEarlyMorning = currentHour >= 5 && currentHour <= 8;
    const isMorning = currentHour >= 6 && currentHour <= 11;
    const isAfternoon = currentHour >= 12 && currentHour <= 17;
    
    if (completionPercentage === 100) {
      return {
        message: "Perfect day! You're absolutely crushing it! 🌟",
        icon: "🎉",
        color: "text-green-800",
        bgColor: "bg-green-50 border-green-200"
      };
    } else if (completionPercentage >= 80) {
      return {
        message: "Great job! You're on fire! Keep up the continued success! 🔥",
        icon: "🔥",
        color: "text-orange-800",
        bgColor: "bg-orange-50 border-orange-200"
      };
    } else if (completionPercentage >= 50) {
      const encouragement = isEarlyMorning 
        ? "Perfect timing! You're halfway there - finish strong! 💪"
        : "Good progress! You're halfway there - you've got this! 💪";
      return {
        message: encouragement,
        icon: "💪",
        color: "text-blue-800",
        bgColor: "bg-blue-50 border-blue-200"
      };
    } else if (completedToday > 0) {
      const timeBasedMessage = isEarlyMorning 
        ? "Great start! Perfect time to complete your remaining rituals! ✨"
        : "Nice start! Every ritual completed is a win! ✨";
      return {
        message: timeBasedMessage,
        icon: "✨",
        color: "text-purple-800",
        bgColor: "bg-purple-50 border-purple-200"
      };
    } else {
      if (isEarlyMorning) {
        return {
          message: "Perfect timing! Early bird gets the transformation! 🌅",
          icon: "🌅",
          color: "text-amber-800",
          bgColor: "bg-amber-50 border-amber-200"
        };
      } else if (isMorning) {
        return {
          message: "Good morning! Your rituals are ready to transform your day! ☀️",
          icon: "☀️",
          color: "text-yellow-800",
          bgColor: "bg-yellow-50 border-yellow-200"
        };
      } else if (isAfternoon) {
        return {
          message: "Never too late! Afternoon rituals can still elevate your day! 🌤️",
          icon: "🌤️",
          color: "text-indigo-800",
          bgColor: "bg-indigo-50 border-indigo-200"
        };
      } else {
        return {
          message: "Evening reflection time - prepare for tomorrow's success! 🌙",
          icon: "🌙",
          color: "text-slate-800",
          bgColor: "bg-slate-50 border-slate-200"
        };
      }
    }
  };

  const motivation = getMotivationalMessage();
  const remainingRituals = totalRituals - completedToday;

  // Get progress bar color based on completion
  const getProgressColor = () => {
    if (completionPercentage >= 90) return "bg-green-500";
    if (completionPercentage >= 70) return "bg-orange-500";
    if (completionPercentage >= 50) return "bg-yellow-500";
    return "bg-blue-500";
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Main Progress Card */}
      <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-orange-200 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-800">Today's Progress</CardTitle>
                <p className="text-sm text-gray-600 font-medium">{todayFormatted}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-lg px-4 py-2 shadow-md">
                {completionPercentage}% Complete
              </Badge>
              {overallStreak > 0 && (
                <div className="flex items-center mt-2 text-sm text-orange-700">
                  <Flame className="h-4 w-4 mr-1" />
                  <span className="font-semibold">{overallStreak}-day streak</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enhanced Progress Overview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700 font-medium">Completion Progress</span>
              <span className="font-bold text-lg">
                {completedToday} of {totalRituals} rituals completed
              </span>
            </div>
            <div className="relative">
              <Progress value={completionPercentage} className="h-4 bg-gray-200" />
              <div 
                className={`absolute top-0 left-0 h-4 rounded-full transition-all duration-700 ease-out ${getProgressColor()}`}
                style={{ width: `${completionPercentage}%` }}
              />
              {completionPercentage > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white drop-shadow-sm">
                    {completionPercentage}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Streak Information */}
          <div className={`flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm`}>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <span className="font-bold text-lg text-gray-800">{overallStreak}-day streak</span>
                <p className="text-sm text-gray-600">
                  {overallStreak === 0 ? "Start your journey today!" : "Keep the momentum going!"}
                </p>
              </div>
            </div>
            {overallStreak >= 7 && (
              <div className="flex space-x-2">
                <Badge className="bg-green-100 text-green-800">
                  <Trophy className="h-3 w-3 mr-1" />
                  Week Champion!
                </Badge>
                {overallStreak >= 30 && (
                  <Badge className="bg-purple-100 text-purple-800">
                    <Zap className="h-3 w-3 mr-1" />
                    Habit Master!
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Enhanced Motivation Message */}
          <div className={`p-4 rounded-lg border-2 ${motivation.bgColor}`}>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{motivation.icon}</span>
              <div>
                <p className={`font-semibold ${motivation.color}`}>
                  {motivation.message}
                </p>
                {completionPercentage > 0 && completionPercentage < 100 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {remainingRituals} more ritual{remainingRituals !== 1 ? 's' : ''} to complete your perfect day!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Quick Action */}
          {remainingRituals > 0 && (
            <div className="pt-2">
              <Button 
                onClick={onCompleteRemaining}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Complete Remaining ({remainingRituals})
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="p-2 bg-green-100 rounded-full w-fit mx-auto mb-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{completedToday}</div>
            <div className="text-xs text-gray-600 font-medium">Completed Today</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="p-2 bg-blue-100 rounded-full w-fit mx-auto mb-3">
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{remainingRituals}</div>
            <div className="text-xs text-gray-600 font-medium">Remaining</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="p-2 bg-orange-100 rounded-full w-fit mx-auto mb-3">
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{overallStreak}</div>
            <div className="text-xs text-gray-600 font-medium">Day Streak</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="p-2 bg-purple-100 rounded-full w-fit mx-auto mb-3">
              <Target className="h-8 w-8 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{completionPercentage}%</div>
            <div className="text-xs text-gray-600 font-medium">Success Rate</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper function to calculate overall streak
function calculateOverallStreak(rituals: MorningRitual[]): number {
  if (rituals.length === 0) return 0;
  
  const today = new Date();
  let currentStreak = 0;
  
  // Check each day going backwards from today
  for (let i = 0; i < 30; i++) { // Check last 30 days
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    
    const dayCompletions = rituals.filter(ritual => {
      if (!ritual.lastCompleted) return false;
      const completionDate = new Date(ritual.lastCompleted);
      return completionDate.toDateString() === checkDate.toDateString();
    }).length;
    
    const dayCompletionRate = dayCompletions / rituals.length;
    
    if (dayCompletionRate >= 0.8) { // 80% completion threshold
      if (i === 0 || currentStreak > 0) { // Today or continuing streak
        currentStreak++;
      }
    } else {
      break; // Streak broken
    }
  }
  
  return currentStreak;
}

export default DailyStatusDashboard;
