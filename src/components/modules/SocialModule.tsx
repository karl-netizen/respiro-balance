import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Trophy, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SocialModule() {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <span>👥</span> Social Hub
        </CardTitle>
        <CardDescription>Connect with the community</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Join wellness challenges, share achievements, and meditate with friends in the community.
        </p>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-muted rounded-lg">
            <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">Friends</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <Trophy className="w-5 h-5 mx-auto mb-1 text-warning" />
            <p className="text-xs text-muted-foreground">Challenges</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <Share2 className="w-5 h-5 mx-auto mb-1 text-success" />
            <p className="text-xs text-muted-foreground">Share</p>
          </div>
        </div>

        <Button className="w-full" onClick={() => navigate('/social')}>
          Explore Community
        </Button>
      </CardContent>
    </Card>
  );
}
