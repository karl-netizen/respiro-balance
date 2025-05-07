
import React from 'react';
import { useMeditationStats } from './useMeditationStats';
import { Flame, Calendar, Clock, Star } from 'lucide-react';

const ProgressHero = () => {
  const { meditationStats } = useMeditationStats();
  
  return (
    <div className="bg-gradient-to-r from-primary/30 to-secondary/30 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Your Meditation Journey</h1>
          <p className="text-lg text-muted-foreground">
            Track your progress and insights from your meditation practice
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-3">
            <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Time</p>
              <p className="text-xl font-bold">{meditationStats.totalMinutes} min</p>
            </div>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-3">
            <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sessions</p>
              <p className="text-xl font-bold">{meditationStats.totalSessions}</p>
            </div>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-3">
            <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Flame className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Streak</p>
              <p className="text-xl font-bold">{meditationStats.streak} days</p>
            </div>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-3">
            <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Achievements</p>
              <p className="text-xl font-bold">
                {meditationStats.achievementProgress?.unlocked || 0}/{meditationStats.achievementProgress?.total || 10}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressHero;
