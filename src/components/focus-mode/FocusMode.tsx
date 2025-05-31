import React, { useState, useEffect } from 'react';
import { FocusSession, FocusStats } from './types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductivityMetrics } from './analytics/ProductivityMetrics';
import { ProductivityHeatmap } from './analytics/ProductivityHeatmap';
import { TrendAnalysis } from './analytics/TrendAnalysis';
import { InsightsGenerator, generateProductivityInsights } from './analytics/InsightsGenerator';
import { FocusScoreCalculator } from './analytics/FocusScoreCalculator';

export const FocusMode: React.FC = () => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [currentSession, setCurrentSession] = useState<Partial<FocusSession> | null>(null);
  const [stats, setStats] = useState<FocusStats>({
    totalSessions: 0,
    totalMinutes: 0,
    averageSessionLength: 0,
    mostProductiveDay: 'Monday', // Default value
    mostProductiveTime: 'Morning', // Default value
    highestFocusScore: 0,
    weeklyMinutes: [0, 0, 0, 0, 0, 0, 0],
    distractionRate: 0,
    completionRate: 0,
    streak: 0
  });

  // Analytics data for new components
  const [heatmapData, setHeatmapData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchAnalyticsData();
    }
  }, [user]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isActive && !isPaused && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      // Timer completed
      handleSessionComplete();
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, isPaused, timeRemaining]);

  const fetchAnalyticsData = async () => {
    if (!user) return;

    try {
      // Get last 30 days for heatmap
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: sessions, error } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_time', thirtyDaysAgo.toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;

      if (sessions) {
        // Generate heatmap data
        const heatmap = generateHeatmapData(sessions);
        setHeatmapData(heatmap);

        // Generate trend data
        const trends = generateTrendData(sessions);
        setTrendData(trends);

        // Generate insights
        const generatedInsights = generateProductivityInsights(sessions, {
          currentFocusScore: FocusScoreCalculator.calculateWeeklyScore(sessions.slice(-7)),
          avgDistractions: sessions.reduce((sum, s) => sum + (s.distractions || 0), 0) / sessions.length,
          completionRate: (sessions.filter(s => s.completed).length / sessions.length) * 100
        });
        setInsights(generatedInsights);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const generateHeatmapData = (sessions: any[]) => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    return last30Days.map(dateStr => {
      const daySessions = sessions.filter(s => 
        s.start_time.split('T')[0] === dateStr && s.completed
      );
      
      const intensity = Math.min(4, Math.floor(daySessions.length / 2));
      const avgScore = daySessions.length > 0 
        ? daySessions.reduce((sum, s) => sum + (s.focus_score || 70), 0) / daySessions.length 
        : 0;

      return {
        date: dateStr,
        intensity,
        sessions: daySessions.length,
        focusScore: Math.round(avgScore)
      };
    });
  };

  const generateTrendData = (sessions: any[]) => {
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (13 - i));
      return date.toISOString().split('T')[0];
    });

    return last14Days.map(dateStr => {
      const daySessions = sessions.filter(s => 
        s.start_time.split('T')[0] === dateStr && s.completed
      );
      
      const avgScore = daySessions.length > 0 
        ? daySessions.reduce((sum, s) => sum + (s.focus_score || 70), 0) / daySessions.length 
        : 0;

      return {
        date: dateStr,
        focusScore: Math.round(avgScore),
        sessions: daySessions.length,
        distractions: daySessions.reduce((sum, s) => sum + (s.distractions || 0), 0),
        productivity: Math.round(avgScore * 0.8) // Simplified productivity score
      };
    });
  };

  const fetchStats = async () => {
    if (!user) return;
    
    try {
      // Fetch and calculate stats from completed sessions
      const { data: sessions, error } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('userId', user.id);
        
      if (error) throw error;
      
      if (sessions && sessions.length > 0) {
        // Calculate stats
        const totalSessions = sessions.length;
        const totalMinutes = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
        const totalDays = calculateUniqueDays(sessions);
        const avgSessionLength = totalSessions > 0 ? totalMinutes / totalSessions : 0;
        const avgFocusTime = totalDays > 0 ? totalMinutes / totalDays : 0;
        
        // Calculate most productive day and time
        // This would typically be more complex, this is a simplified version
        const dayCount: Record<string, number> = {};
        const timeCount: Record<string, number> = {};
        
        sessions.forEach(session => {
          const date = new Date(session.startTime);
          const day = date.toLocaleString('en-US', { weekday: 'long' });
          const hour = date.getHours();
          let timeOfDay = 'Morning';
          
          if (hour >= 12 && hour < 17) timeOfDay = 'Afternoon';
          else if (hour >= 17) timeOfDay = 'Evening';
          
          dayCount[day] = (dayCount[day] || 0) + 1;
          timeCount[timeOfDay] = (timeCount[timeOfDay] || 0) + 1;
        });
        
        const mostProductiveDay = Object.keys(dayCount).length > 0 
          ? Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0][0]
          : 'Monday'; // Default
          
        const mostProductiveTime = Object.keys(timeCount).length > 0
          ? Object.entries(timeCount).sort((a, b) => b[1] - a[1])[0][0]
          : 'Morning'; // Default
        
        // Calculate weekly minutes (simplified)
        const weeklyMinutes = [0, 0, 0, 0, 0, 0, 0]; // Sun to Sat
        
        // Other stats
        const completionRate = sessions.filter(s => s.taskCompleted).length / totalSessions * 100;
        const distractionCount = sessions.reduce((sum, s) => sum + (s.distractionCount || 0), 0);
        const distractionRate = distractionCount / totalSessions;
        const currentStreak = calculateCurrentStreak(sessions);
        const longestStreak = calculateLongestStreak(sessions);
        
        // Fixed stats object with all required fields
        setStats({
          totalSessions,
          totalMinutes,
          averageSessionLength: avgSessionLength,
          mostProductiveDay,
          mostProductiveTime,
          highestFocusScore: Math.max(...sessions.map(s => s.focusScore || 0)),
          weeklyMinutes,
          distractionRate,
          completionRate,
          streak: currentStreak, // For backward compatibility
          totalDays,
          averageFocusTime: avgFocusTime,
          longestStreak,
          currentStreak,
          weeklyFocusTime: totalMinutes, // Simplified
          weeklyFocusProgress: 0 // Add missing required field
        });
      }
    } catch (error) {
      console.error('Error fetching focus stats:', error);
    }
  };
  
  const calculateUniqueDays = (sessions: FocusSession[]): number => {
    const uniqueDays = new Set();
    
    sessions.forEach(session => {
      const date = new Date(session.startTime);
      const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      uniqueDays.add(dateString);
    });
    
    return uniqueDays.size;
  };
  
  const calculateCurrentStreak = (sessions: FocusSession[]): number => {
    if (sessions.length === 0) return 0;
    
    // Sort sessions by date (newest first)
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
    
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if there's a session today
    const latestSession = new Date(sortedSessions[0].startTime);
    latestSession.setHours(0, 0, 0, 0);
    
    if (latestSession.getTime() !== today.getTime() && 
        latestSession.getTime() !== today.getTime() - 86400000) {
      // No session today or yesterday, streak is broken
      return 0;
    }
    
    // Count consecutive days
    let streak = 1;
    let currentDate = latestSession;
    
    for (let i = 1; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i].startTime);
      sessionDate.setHours(0, 0, 0, 0);
      
      // Check if this session is from the previous day
      const expectedPrevDay = new Date(currentDate);
      expectedPrevDay.setDate(expectedPrevDay.getDate() - 1);
      
      if (sessionDate.getTime() === expectedPrevDay.getTime()) {
        streak++;
        currentDate = sessionDate;
      } else if (sessionDate.getTime() !== currentDate.getTime()) {
        // This session is from a different day, not consecutive
        break;
      }
    }
    
    return streak;
  };
  
  const calculateLongestStreak = (sessions: FocusSession[]): number => {
    if (sessions.length === 0) return 0;
    
    // Sort sessions by date (oldest first)
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    
    // Get unique days with sessions
    const sessionDays = new Set<string>();
    sortedSessions.forEach(session => {
      const date = new Date(session.startTime);
      const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      sessionDays.add(dateString);
    });
    
    // Convert to array and sort
    const days = Array.from(sessionDays).sort();
    
    let currentStreak = 1;
    let longestStreak = 1;
    
    for (let i = 1; i < days.length; i++) {
      const prevDate = new Date(days[i-1]);
      const currDate = new Date(days[i]);
      
      // Check if dates are consecutive
      const expectedDate = new Date(prevDate);
      expectedDate.setDate(expectedDate.getDate() + 1);
      
      if (currDate.getTime() === expectedDate.getTime()) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return longestStreak;
  };

  const startSession = () => {
    // Convert Date to string to avoid type errors
    const startTimeString = new Date().toISOString();
    
    // Create a new session with proper types
    const newSession: Partial<FocusSession> = {
      userId: user?.id || '',
      startTime: startTimeString,
      taskCompleted: false,
      distractionCount: 0
    };
    
    setCurrentSession(newSession);
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseSession = () => {
    setIsPaused(true);
  };
  
  const resumeSession = () => {
    setIsPaused(false);
  };

  const handleSessionComplete = async () => {
    if (!currentSession || !user) return;
    
    try {
      // Calculate duration and set end time
      const endTime = new Date().toISOString();
      const startTime = new Date(currentSession.startTime || '');
      const durationMinutes = Math.round((new Date().getTime() - startTime.getTime()) / (1000 * 60));
      
      const focusScore = FocusScoreCalculator.calculateSessionScore(currentSession);
      
      const completedSession: Partial<FocusSession> = {
        ...currentSession,
        endTime,
        duration: durationMinutes,
        taskCompleted: true, // You might want to ask the user
        focus_score: focusScore
      };
      
      // Save to database - make sure field names match your schema
      const { error } = await supabase
        .from('focus_sessions')
        .insert(completedSession);
        
      if (error) throw error;
      
      // Reset state
      setCurrentSession(null);
      setIsActive(false);
      setTimeRemaining(25 * 60); // Reset timer
      
      // Refresh stats
      fetchStats();
    } catch (error) {
      console.error('Error completing focus session:', error);
    }
  };

  const cancelSession = () => {
    if (window.confirm('Are you sure you want to cancel this focus session?')) {
      setCurrentSession(null);
      setIsActive(false);
      setIsPaused(false);
      setTimeRemaining(25 * 60); // Reset to 25 minutes
    }
  };
  
  const recordDistraction = () => {
    if (currentSession) {
      setCurrentSession(prev => ({
        ...prev,
        distractionCount: (prev?.distractionCount || 0) + 1
      }));
    }
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Existing Timer Section */}
      <div className="flex flex-col items-center justify-center p-6 bg-card rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Focus Timer</h2>
        
        <div className="text-6xl font-mono font-bold mb-8">
          {formatTime(timeRemaining)}
        </div>
        
        <div className="flex space-x-4">
          {!isActive ? (
            <button 
              onClick={startSession}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md"
            >
              Start Focus
            </button>
          ) : (
            <>
              {isPaused ? (
                <button 
                  onClick={resumeSession}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-md"
                >
                  Resume
                </button>
              ) : (
                <button 
                  onClick={pauseSession}
                  className="bg-muted text-muted-foreground px-6 py-2 rounded-md"
                >
                  Pause
                </button>
              )}
              <button 
                onClick={cancelSession}
                className="bg-destructive text-destructive-foreground px-6 py-2 rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={recordDistraction}
                className="bg-amber-500 text-white px-6 py-2 rounded-md"
              >
                Record Distraction
              </button>
            </>
          )}
        </div>
      </div>

      {/* New Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Existing Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Stats</h3>
              <div className="space-y-2">
                <p>Total Sessions: {stats.totalSessions}</p>
                <p>Total Minutes: {stats.totalMinutes}</p>
                <p>Avg. Session Length: {stats.averageSessionLength.toFixed(1)} min</p>
                <p>Current Streak: {stats.currentStreak} days</p>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Patterns</h3>
              <div className="space-y-2">
                <p>Most Productive Day: {stats.mostProductiveDay}</p>
                <p>Most Productive Time: {stats.mostProductiveTime}</p>
                <p>Task Completion Rate: {stats.completionRate.toFixed(1)}%</p>
                <p>Avg. Distractions: {stats.distractionRate.toFixed(1)}/session</p>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">This Week</h3>
              <div className="flex items-end h-32 space-x-1">
                {stats.weeklyMinutes.map((mins, idx) => (
                  <div 
                    key={idx}
                    className="bg-primary h-full rounded-t"
                    style={{ 
                      height: `${Math.min((mins / 120) * 100, 100)}%`,
                      flex: '1 1 0' 
                    }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between mt-1 text-xs">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProductivityMetrics />
            <ProductivityHeatmap data={heatmapData} />
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <TrendAnalysis data={trendData} timeframe="month" />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <InsightsGenerator 
            insights={insights} 
            onActionClick={(insight) => {
              console.log('Action clicked:', insight);
              // Handle insight actions
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FocusMode;
