
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Users, Target, Flame, Bell } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number; // days
  participants: number;
  maxParticipants: number;
  goal: string;
  reward: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'upcoming' | 'completed';
  progress: number;
  leaderboard: Array<{
    rank: number;
    name: string;
    progress: number;
    streak: number;
  }>;
}

export default function GroupChallengesSystem() {
  const [challenges] = useState<Challenge[]>([
    {
      id: '1',
      title: '21-Day Mindfulness Challenge',
      description: 'Build a consistent meditation practice with daily 10-minute sessions',
      duration: 21,
      participants: 847,
      maxParticipants: 1000,
      goal: 'Complete 21 consecutive days of meditation',
      reward: 'Exclusive mindfulness badge + 500 bonus coins',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-05'),
      status: 'active',
      progress: 65,
      leaderboard: [
        { rank: 1, name: 'Sarah M.', progress: 95, streak: 20 },
        { rank: 2, name: 'David L.', progress: 90, streak: 19 },
        { rank: 3, name: 'Emma K.', progress: 85, streak: 18 },
        { rank: 4, name: 'You', progress: 75, streak: 16 },
        { rank: 5, name: 'Alex R.', progress: 70, streak: 15 }
      ]
    },
    {
      id: '2',
      title: 'Stress-Free Week',
      description: 'Focus on stress reduction techniques and breathing exercises',
      duration: 7,
      participants: 234,
      maxParticipants: 500,
      goal: 'Complete 5 stress-relief sessions this week',
      reward: 'Stress relief achievement + guided relaxation pack',
      startDate: new Date('2024-02-10'),
      endDate: new Date('2024-02-17'),
      status: 'upcoming',
      progress: 0,
      leaderboard: []
    },
    {
      id: '3',
      title: 'Morning Meditation Masters',
      description: 'Start your day right with consistent morning meditation',
      duration: 14,
      participants: 156,
      maxParticipants: 300,
      goal: 'Meditate before 9 AM for 14 days',
      reward: 'Early bird badge + premium wake-up sounds',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-15'),
      status: 'active',
      progress: 45,
      leaderboard: [
        { rank: 1, name: 'Michael P.', progress: 100, streak: 14 },
        { rank: 2, name: 'Lisa T.', progress: 95, streak: 13 },
        { rank: 3, name: 'James W.', progress: 90, streak: 12 }
      ]
    }
  ]);

  const [joinedChallenges, setJoinedChallenges] = useState<string[]>(['1', '3']);

  const handleJoinChallenge = (challengeId: string) => {
    setJoinedChallenges(prev => [...prev, challengeId]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'upcoming': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          Group Challenges
        </h2>
        <Badge variant="outline" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          Premium Pro
        </Badge>
      </div>

      {/* Active Challenges */}
      <div className="grid gap-4">
        {challenges.map(challenge => (
          <Card key={challenge.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(challenge.status)}`} />
                  <div>
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    <CardDescription>{challenge.description}</CardDescription>
                  </div>
                </div>
                <Badge variant="outline">
                  {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Challenge Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{challenge.duration}</div>
                  <p className="text-xs text-muted-foreground">Days</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{challenge.participants}</div>
                  <p className="text-xs text-muted-foreground">Participants</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatDate(challenge.startDate)}
                  </div>
                  <p className="text-xs text-muted-foreground">Start Date</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatDate(challenge.endDate)}
                  </div>
                  <p className="text-xs text-muted-foreground">End Date</p>
                </div>
              </div>

              {/* Progress */}
              {challenge.status === 'active' && joinedChallenges.includes(challenge.id) && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Your Progress</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <Progress value={challenge.progress} className="h-2" />
                </div>
              )}

              {/* Goal and Reward */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-sm">Goal</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{challenge.goal}</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-sm">Reward</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{challenge.reward}</p>
                </div>
              </div>

              {/* Leaderboard */}
              {challenge.leaderboard.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Leaderboard</h4>
                  <div className="space-y-1">
                    {challenge.leaderboard.slice(0, 5).map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">#{entry.rank}</span>
                          <span className="text-sm">{entry.name}</span>
                          {entry.name === 'You' && (
                            <Badge variant="secondary" className="text-xs">You</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Flame className="h-3 w-3" />
                          <span>{entry.streak}d</span>
                          <span>{entry.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {joinedChallenges.includes(challenge.id) ? (
                  <div className="flex gap-2 w-full">
                    <Button className="flex-1" disabled>
                      <Users className="h-4 w-4 mr-2" />
                      Joined
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bell className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => handleJoinChallenge(challenge.id)}
                    className="flex-1"
                    disabled={challenge.participants >= challenge.maxParticipants}
                  >
                    Join Challenge
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Challenge */}
      <Card>
        <CardHeader>
          <CardTitle>Create Your Own Challenge</CardTitle>
          <CardDescription>
            Start a custom challenge for your community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <Target className="h-4 w-4 mr-2" />
            Create Challenge
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
