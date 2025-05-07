
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy } from 'lucide-react';
import { FocusAchievement } from './types';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const FocusAchievements: React.FC = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<FocusAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      fetchAchievements();
    } else {
      // If no user, use demo data
      setAchievements(getDemoAchievements());
      setLoading(false);
    }
  }, [user]);
  
  const fetchAchievements = async () => {
    // In a real app, you would fetch from Supabase
    // For now, use demo data
    setAchievements(getDemoAchievements());
    setLoading(false);
  };
  
  const getDemoAchievements = (): FocusAchievement[] => [
    {
      id: '1',
      name: 'First Focus',
      description: 'Complete your first focus session',
      icon: 'trophy',
      progress: 100,
      unlockedAt: new Date().toISOString(),
      criteria: {
        type: 'total_sessions',
        threshold: 1
      }
    },
    {
      id: '2',
      name: 'Focus Streak',
      description: 'Complete 3 days of focus sessions in a row',
      icon: 'target',
      progress: 33,
      criteria: {
        type: 'streak',
        threshold: 3
      }
    },
    {
      id: '3',
      name: 'Deep Work',
      description: 'Accumulate 10 hours of focus time',
      icon: 'clock',
      progress: 45,
      criteria: {
        type: 'total_time',
        threshold: 600
      }
    },
    {
      id: '4',
      name: 'Focus Master',
      description: 'Achieve a focus score of 90+',
      icon: 'award',
      progress: 70,
      criteria: {
        type: 'score',
        threshold: 90
      }
    }
  ];
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-orange-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <svg className="animate-spin h-8 w-8 text-muted-foreground mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-orange-500" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {achievements.map(achievement => (
          <div key={achievement.id} className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{achievement.name}</p>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </div>
              {achievement.unlockedAt && (
                <div className="bg-green-100 text-green-800 px-1.5 py-0.5 text-xs rounded">
                  Achieved
                </div>
              )}
            </div>
            <Progress value={achievement.progress} className="h-1.5" />
          </div>
        ))}
        
        {achievements.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No achievements yet</p>
            <p className="text-xs mt-1">Complete focus sessions to earn achievements</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
