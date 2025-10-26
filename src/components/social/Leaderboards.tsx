
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Medal, Target, Brain, Zap } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  user: {
    name: string;
    avatar?: string;
    level: number;
  };
  score: number;
  change: number;
}

export const Leaderboards: React.FC = () => {

  const meditationLeaderboard: LeaderboardEntry[] = [
    { rank: 1, user: { name: 'Alex Rivera', level: 20 }, score: 450, change: 2 },
    { rank: 2, user: { name: 'Sarah Chen', level: 18 }, score: 425, change: -1 },
    { rank: 3, user: { name: 'Emma Wilson', level: 15 }, score: 380, change: 1 },
    { rank: 4, user: { name: 'Mike Johnson', level: 12 }, score: 350, change: 0 },
    { rank: 5, user: { name: 'David Kim', level: 14 }, score: 325, change: 3 }
  ];

  const focusLeaderboard: LeaderboardEntry[] = [
    { rank: 1, user: { name: 'Emma Wilson', level: 15 }, score: 2840, change: 1 },
    { rank: 2, user: { name: 'David Kim', level: 14 }, score: 2650, change: -1 },
    { rank: 3, user: { name: 'Alex Rivera', level: 20 }, score: 2480, change: 0 },
    { rank: 4, user: { name: 'Sarah Chen', level: 18 }, score: 2340, change: 2 },
    { rank: 5, user: { name: 'Mike Johnson', level: 12 }, score: 2180, change: -1 }
  ];

  const streakLeaderboard: LeaderboardEntry[] = [
    { rank: 1, user: { name: 'Sarah Chen', level: 18 }, score: 45, change: 0 },
    { rank: 2, user: { name: 'Emma Wilson', level: 15 }, score: 38, change: 1 },
    { rank: 3, user: { name: 'Alex Rivera', level: 20 }, score: 32, change: -1 },
    { rank: 4, user: { name: 'David Kim', level: 14 }, score: 28, change: 0 },
    { rank: 5, user: { name: 'Mike Johnson', level: 12 }, score: 24, change: 2 }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <div className="w-5 h-5 flex items-center justify-center text-sm font-bold">{rank}</div>;
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const renderLeaderboard = (data: LeaderboardEntry[], unit: string) => (
    <div className="space-y-3">
      {data.map((entry) => (
        <Card key={entry.rank}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {getRankIcon(entry.rank)}
                <Avatar className="h-10 w-10">
                  <AvatarImage src={entry.user.avatar} />
                  <AvatarFallback>{entry.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{entry.user.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Level {entry.user.level}</Badge>
                      {entry.change !== 0 && (
                        <span className={`text-xs ${getChangeColor(entry.change)}`}>
                          {entry.change > 0 ? '↑' : '↓'} {Math.abs(entry.change)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{entry.score.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{unit}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Leaderboards</h2>
          <p className="text-muted-foreground">See how you rank among your peers</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Your Rank: #15</Badge>
        </div>
      </div>

      <Tabs defaultValue="meditation" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="meditation" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Meditation
          </TabsTrigger>
          <TabsTrigger value="focus" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Focus
          </TabsTrigger>
          <TabsTrigger value="streaks" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Streaks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="meditation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Meditation Minutes This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderLeaderboard(meditationLeaderboard, 'minutes')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="focus">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" />
                Focus Minutes This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderLeaderboard(focusLeaderboard, 'minutes')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streaks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                Current Streaks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderLeaderboard(streakLeaderboard, 'days')}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
