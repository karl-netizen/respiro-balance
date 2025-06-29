
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, Share2, MessageCircle, Heart, Calendar } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number;
  participants: number;
  reward: string;
  difficulty: 'easy' | 'medium' | 'hard';
  startDate: string;
  endDate: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  shareCount: number;
}

interface CommunityFeaturesProps {
  challenges: Challenge[];
  achievements: Achievement[];
  onJoinChallenge: (challengeId: string) => void;
  onShareAchievement: (achievementId: string) => void;
}

export const CommunityFeatures: React.FC<CommunityFeaturesProps> = ({
  challenges,
  achievements,
  onJoinChallenge,
  onShareAchievement
}) => {
  const [selectedTab, setSelectedTab] = useState('challenges');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Groups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-4">
          <div className="grid gap-4">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{challenge.title}</h3>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {challenge.duration} days
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {challenge.participants} participants
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          {challenge.reward}
                        </span>
                      </div>
                    </div>
                    <Button onClick={() => onJoinChallenge(challenge.id)}>
                      Join Challenge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Heart className="h-4 w-4" />
                        {achievement.shareCount}
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onShareAchievement(achievement.id)}
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Group Meditation Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Real-time Group Sessions</h3>
                <p className="text-muted-foreground mb-4">
                  Join synchronized meditation sessions with other users around the world.
                </p>
                <Button>Find Active Session</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
