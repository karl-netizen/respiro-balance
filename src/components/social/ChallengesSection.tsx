
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, Trophy, Target, Zap, Brain, Clock } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'meditation' | 'focus' | 'streak' | 'community';
  duration: string;
  participants: number;
  progress: number;
  target: number;
  reward: string;
  isJoined: boolean;
  endsIn: string;
}

export const ChallengesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');

  const activeChallenges: Challenge[] = [
    {
      id: '1',
      title: 'Weekly Meditation Marathon',
      description: 'Meditate for 7 days straight, minimum 10 minutes per session',
      type: 'meditation',
      duration: '7 days',
      participants: 234,
      progress: 4,
      target: 7,
      reward: '500 XP + Zen Master Badge',
      isJoined: true,
      endsIn: '3 days'
    },
    {
      id: '2',
      title: 'Deep Focus Challenge',
      description: 'Complete 5 sessions of 45+ minute focused work',
      type: 'focus',
      duration: '2 weeks',
      participants: 156,
      progress: 2,
      target: 5,
      reward: '750 XP + Focus Champion Badge',
      isJoined: true,
      endsIn: '10 days'
    },
    {
      id: '3',
      title: 'Community Mindfulness Month',
      description: 'Join with friends to collectively reach 1000 meditation minutes',
      type: 'community',
      duration: '30 days',
      participants: 48,
      progress: 340,
      target: 1000,
      reward: 'Exclusive Group Badge + Bonus XP',
      isJoined: false,
      endsIn: '22 days'
    }
  ];

  const availableChallenges: Challenge[] = [
    {
      id: '4',
      title: 'Morning Ritual Master',
      description: 'Start each day with a 15-minute meditation for 14 days',
      type: 'streak',
      duration: '14 days',
      participants: 89,
      progress: 0,
      target: 14,
      reward: '600 XP + Early Bird Badge',
      isJoined: false,
      endsIn: 'Starts tomorrow'
    },
    {
      id: '5',
      title: 'Productivity Sprint',
      description: 'Complete 20 Pomodoro sessions in one week',
      type: 'focus',
      duration: '7 days',
      participants: 178,
      progress: 0,
      target: 20,
      reward: '400 XP + Sprint Master Badge',
      isJoined: false,
      endsIn: 'Starts in 3 days'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meditation':
        return <Brain className="h-4 w-4 text-purple-500" />;
      case 'focus':
        return <Zap className="h-4 w-4 text-orange-500" />;
      case 'streak':
        return <Target className="h-4 w-4 text-green-500" />;
      case 'community':
        return <Users className="h-4 w-4 text-blue-500" />;
      default:
        return <Trophy className="h-4 w-4" />;
    }
  };

  const joinChallenge = (challengeId: string) => {
    console.log('Joining challenge:', challengeId);
  };

  const renderChallenge = (challenge: Challenge) => (
    <Card key={challenge.id}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getTypeIcon(challenge.type)}
              <CardTitle className="text-lg">{challenge.title}</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">{challenge.description}</p>
          </div>
          <Badge variant={challenge.isJoined ? "default" : "outline"}>
            {challenge.isJoined ? 'Joined' : 'Available'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{challenge.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{challenge.participants} joined</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <span>{challenge.reward}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{challenge.endsIn}</span>
          </div>
        </div>

        {challenge.isJoined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{challenge.progress} / {challenge.target}</span>
            </div>
            <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
          </div>
        )}

        <div className="flex justify-end">
          {challenge.isJoined ? (
            <Button variant="outline" disabled>
              <Target className="h-4 w-4 mr-2" />
              In Progress
            </Button>
          ) : (
            <Button onClick={() => joinChallenge(challenge.id)}>
              <Users className="h-4 w-4 mr-2" />
              Join Challenge
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Challenges</h2>
        <p className="text-muted-foreground">Join challenges to earn rewards and stay motivated</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Challenges</TabsTrigger>
          <TabsTrigger value="available">Available Challenges</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeChallenges.map(renderChallenge)}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          {availableChallenges.map(renderChallenge)}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Completed Challenges Yet</h3>
              <p className="text-muted-foreground">
                Complete your first challenge to see your achievements here!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
