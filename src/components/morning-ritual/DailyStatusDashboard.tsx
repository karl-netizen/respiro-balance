
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, CheckCircle, Clock, Target } from 'lucide-react';
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
  
  // Generate motivational message
  const getMotivationalMessage = () => {
    if (completionPercentage === 100) {
      return "Perfect day! You're absolutely crushing it! 🌟";
    } else if (completionPercentage >= 80) {
      return "Great job! You're on fire! Keep up the continued success! 🔥";
    } else if (completionPercentage >= 50) {
      return "Good progress! You're halfway there - you've got this! 💪";
    } else if (completedToday > 0) {
      return "Nice start! Every ritual completed is a win! ✨";
    } else {
      return "Ready to start your day? Your morning rituals are waiting! 🌅";
    }
  };

  const remainingRituals = totalRituals - completedToday;

  return (
    <div className="space-y-6">
      {/* Main Progress Card */}
      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-gray-800">Today's Progress</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{todayFormatted}</p>
            </div>
            <Badge className="bg-orange-100 text-orange-800 text-sm px-3 py-1">
              {completionPercentage}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Overview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Completion Progress</span>
              <span className="font-medium">
                {completedToday} of {totalRituals} rituals completed
              </span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>

          {/* Streak Information */}
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-semibold text-gray-800">{overallStreak}-day streak</span>
              {overallStreak > 0 && <span className="text-sm text-gray-600">active</span>}
            </div>
            {overallStreak >= 7 && (
              <Badge className="bg-green-100 text-green-800 text-xs">
                Week Champion!
              </Badge>
            )}
          </div>

          {/* Motivation Message */}
          <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-800">
              {getMotivationalMessage()}
            </p>
          </div>

          {/* Quick Action */}
          {remainingRituals > 0 && (
            <Button 
              onClick={onCompleteRemaining}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Remaining ({remainingRituals})
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{completedToday}</div>
            <div className="text-xs text-gray-600">Completed Today</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{remainingRituals}</div>
            <div className="text-xs text-gray-600">Remaining</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{overallStreak}</div>
            <div className="text-xs text-gray-600">Day Streak</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{completionPercentage}%</div>
            <div className="text-xs text-gray-600">Success Rate</div>
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
