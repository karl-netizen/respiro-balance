
import React from 'react';
import { MeditationStats } from '@/components/progress/types/meditationStats';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface ReportContentProps {
  meditationStats: MeditationStats;
  userName: string;
}

const ReportContent: React.FC<ReportContentProps> = ({ meditationStats, userName }) => {
  const today = format(new Date(), 'MMMM d, yyyy');
  
  // Create simple chart data for the report
  const chartData = meditationStats.monthlyTrend?.slice(-7) || [];
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Meditation Progress Report</h1>
        <p className="text-muted-foreground">{userName} | {today}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Summary Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Sessions:</span>
              <span className="font-medium">{meditationStats.totalSessions}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Minutes:</span>
              <span className="font-medium">{meditationStats.totalMinutes}</span>
            </div>
            <div className="flex justify-between">
              <span>Current Streak:</span>
              <span className="font-medium">{meditationStats.streak} days</span>
            </div>
            <div className="flex justify-between">
              <span>Longest Streak:</span>
              <span className="font-medium">{meditationStats.longestStreak} days</span>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Weekly Progress</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Sessions This Week:</span>
              <span className="font-medium">{meditationStats.sessionsThisWeek}</span>
            </div>
            <div className="flex justify-between">
              <span>Weekly Goal:</span>
              <span className="font-medium">{meditationStats.weeklyGoal} sessions</span>
            </div>
            <div className="flex justify-between">
              <span>Completion Rate:</span>
              <span className="font-medium">{meditationStats.completionRate}%</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${Math.min(100, (meditationStats.sessionsThisWeek / meditationStats.weeklyGoal) * 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-center mt-2">
              {meditationStats.sessionsThisWeek} of {meditationStats.weeklyGoal} sessions completed
            </p>
          </div>
        </div>
      </div>
      
      {/* Recent Activity Chart */}
      <div className="border rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="minutes" fill="#9b87f5" name="Minutes Meditated" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-muted-foreground text-center mt-4">
          Your meditation minutes over the past 7 days
        </p>
      </div>
      
      {meditationStats.achievements && meditationStats.achievements.length > 0 && (
        <div className="border rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Recent Achievements</h3>
          <ul className="list-disc pl-6 space-y-2">
            {meditationStats.achievements
              .filter(achievement => achievement.unlocked)
              .slice(0, 5)
              .map((achievement, index) => (
                <li key={index} className="text-base">
                  {achievement.name} - {achievement.description}
                </li>
              ))}
          </ul>
        </div>
      )}
      
      {/* Mood & Focus Insights */}
      <div className="border rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Wellbeing Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-secondary/20 rounded-lg p-4">
            <h4 className="font-medium mb-2">Mood Correlation</h4>
            <p className="text-sm text-muted-foreground mb-2">
              On days with meditation, your mood scores are higher on average.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs">With meditation:</span>
              <span className="font-medium">{meditationStats.moodCorrelation?.withMeditation || 0}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Without meditation:</span>
              <span className="font-medium">{meditationStats.moodCorrelation?.withoutMeditation || 0}%</span>
            </div>
          </div>
          
          <div className="bg-secondary/20 rounded-lg p-4">
            <h4 className="font-medium mb-2">Focus Correlation</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Your focus metrics improve with consistent meditation.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs">With meditation:</span>
              <span className="font-medium">{meditationStats.focusCorrelation?.withMeditation || 0}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Without meditation:</span>
              <span className="font-medium">{meditationStats.focusCorrelation?.withoutMeditation || 0}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center text-sm text-muted-foreground mt-12">
        <p>Generated by Respiro Meditation App</p>
        <p>{format(new Date(), 'MMMM d, yyyy h:mm a')}</p>
      </div>
    </div>
  );
};

export default ReportContent;
