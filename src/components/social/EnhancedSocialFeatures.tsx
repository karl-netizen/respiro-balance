
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Trophy, 
  Heart, 
  MessageCircle, 
  Share,
  TrendingUp,
  Crown,
  Star
} from 'lucide-react';
import { FadeIn, SlideIn } from '@/components/animations/MicroInteractions';

interface ChallengeData {
  id: string;
  title: string;
  participants: number;
  duration: string;
  progress: number;
  reward: string;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  avatar?: string;
  rank: number;
  change: number;
}

const EnhancedSocialFeatures: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard' | 'community'>('challenges');

  const challenges: ChallengeData[] = [
    {
      id: '1',
      title: '30-Day Mindfulness Challenge',
      participants: 847,
      duration: '23 days left',
      progress: 76,
      reward: 'Mindfulness Master Badge'
    },
    {
      id: '2',
      title: 'Weekly Meditation Streak',
      participants: 234,
      duration: '4 days left',
      progress: 85,
      reward: '50 Zen Points'
    }
  ];

  const leaderboard: LeaderboardEntry[] = [
    { id: '1', name: 'Sarah Chen', score: 2840, rank: 1, change: 2 },
    { id: '2', name: 'Mike Johnson', score: 2756, rank: 2, change: -1 },
    { id: '3', name: 'You', score: 2689, rank: 3, change: 1 },
    { id: '4', name: 'Emma Davis', score: 2543, rank: 4, change: 0 },
    { id: '5', name: 'Alex Kumar', score: 2401, rank: 5, change: -2 }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community
          </CardTitle>
          <div className="flex gap-2">
            {(['challenges', 'leaderboard', 'community'] as const).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className="capitalize"
              >
                {tab}
              </Button>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          {activeTab === 'challenges' && (
            <FadeIn>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Active Challenges</h3>
                {challenges.map((challenge, index) => (
                  <SlideIn key={challenge.id} direction="left" delay={index * 100}>
                    <Card className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{challenge.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {challenge.participants} participants • {challenge.duration}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            <Trophy className="h-3 w-3 mr-1" />
                            {challenge.reward}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{challenge.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${challenge.progress}%` }}
                            />
                          </div>
                        </div>
                        
                        <Button className="w-full mt-3" size="sm">
                          Join Challenge
                        </Button>
                      </CardContent>
                    </Card>
                  </SlideIn>
                ))}
              </div>
            </FadeIn>
          )}

          {activeTab === 'leaderboard' && (
            <FadeIn>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">This Week's Leaderboard</h3>
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <SlideIn key={entry.id} direction="right" delay={index * 100}>
                      <div className={`flex items-center justify-between p-3 rounded-lg border ${
                        entry.name === 'You' ? 'bg-primary/5 border-primary' : ''
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                            {entry.rank === 1 && <Crown className="h-4 w-4 text-yellow-500" />}
                            {entry.rank === 2 && <Star className="h-4 w-4 text-gray-400" />}
                            {entry.rank === 3 && <Star className="h-4 w-4 text-orange-500" />}
                            {entry.rank > 3 && <span className="text-sm font-medium">{entry.rank}</span>}
                          </div>
                          
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={entry.avatar} />
                            <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <p className="font-medium">{entry.name}</p>
                            <p className="text-sm text-muted-foreground">{entry.score} points</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {entry.change > 0 && (
                            <Badge variant="secondary" className="text-green-600">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              +{entry.change}
                            </Badge>
                          )}
                          {entry.change < 0 && (
                            <Badge variant="secondary" className="text-red-600">
                              -{Math.abs(entry.change)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </SlideIn>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}

          {activeTab === 'community' && (
            <FadeIn>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Recent Activity</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((item, index) => (
                    <SlideIn key={item} direction="up" delay={index * 100}>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>U{item}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm">
                                <span className="font-medium">User {item}</span> completed a 
                                <span className="font-medium"> 20-minute meditation</span> session
                              </p>
                              <p className="text-xs text-muted-foreground">2 hours ago</p>
                              
                              <div className="flex items-center gap-4 mt-2">
                                <Button variant="ghost" size="sm">
                                  <Heart className="h-4 w-4 mr-1" />
                                  12
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  3
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Share className="h-4 w-4 mr-1" />
                                  Share
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </SlideIn>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedSocialFeatures;
