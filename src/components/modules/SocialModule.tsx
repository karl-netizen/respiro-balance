import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Trophy, TrendingUp } from 'lucide-react';

export default function SocialModule() {
  // Mock data
  const activeChallenges = [
    { id: 1, name: '30-Day Meditation', participants: 156, progress: 12 },
    { id: 2, name: 'Morning Routine Week', participants: 89, progress: 4 }
  ];

  const friends = [
    { id: 1, name: 'Sarah M.', streak: 7, initials: 'SM' },
    { id: 2, name: 'Mike P.', streak: 12, initials: 'MP' },
    { id: 3, name: 'Lisa K.', streak: 5, initials: 'LK' }
  ];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <span>👥</span> Social Hub
        </CardTitle>
        <CardDescription>
          Connect with the wellness community
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Challenges */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Active Challenges</h4>
            <Badge variant="secondary">
              <Trophy className="w-3 h-3 mr-1" />
              {activeChallenges.length}
            </Badge>
          </div>

          {activeChallenges.map(challenge => (
            <div key={challenge.id} className="p-3 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{challenge.name}</span>
                <Badge variant="outline">
                  <Users className="w-3 h-3 mr-1" />
                  {challenge.participants}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3" />
                <span>Day {challenge.progress} of 30</span>
              </div>
            </div>
          ))}
        </div>

        {/* Friends Activity */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Friends Activity</h4>
          
          <div className="space-y-2">
            {friends.map(friend => (
              <div key={friend.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{friend.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{friend.name}</span>
                </div>
                <Badge variant="secondary">
                  🔥 {friend.streak} days
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full" variant="outline">
          Explore Community
        </Button>
      </CardContent>
    </Card>
  );
}
