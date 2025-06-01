
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Share2, Trophy, Zap, Brain } from 'lucide-react';

interface SocialPost {
  id: string;
  user: {
    name: string;
    avatar?: string;
    level: number;
  };
  type: 'achievement' | 'meditation' | 'focus' | 'milestone';
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

export const SocialFeed: React.FC = () => {
  const [newPost, setNewPost] = useState('');
  const [posts] = useState<SocialPost[]>([
    {
      id: '1',
      user: { name: 'Sarah Chen', level: 12 },
      type: 'achievement',
      content: 'Just completed a 30-day meditation streak! 🎉 Feeling more centered and focused than ever.',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 5,
      isLiked: false
    },
    {
      id: '2',
      user: { name: 'Mike Johnson', level: 8 },
      type: 'focus',
      content: 'Crushed a 90-minute deep focus session working on my project. The Pomodoro technique really works!',
      timestamp: '4 hours ago',
      likes: 18,
      comments: 3,
      isLiked: true
    },
    {
      id: '3',
      user: { name: 'Emma Wilson', level: 15 },
      type: 'milestone',
      content: 'Hit 100 hours of total meditation time this month! 🧘‍♀️ Started my wellness journey 6 months ago and the progress has been incredible.',
      timestamp: '6 hours ago',
      likes: 45,
      comments: 12,
      isLiked: false
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'focus':
        return <Zap className="h-4 w-4 text-orange-500" />;
      case 'meditation':
        return <Brain className="h-4 w-4 text-purple-500" />;
      case 'milestone':
        return <Trophy className="h-4 w-4 text-green-500" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  const handleShare = () => {
    if (newPost.trim()) {
      console.log('Sharing post:', newPost);
      setNewPost('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Share New Post */}
      <Card>
        <CardHeader>
          <CardTitle>Share Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Share your wellness achievements, insights, or milestones..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Badge variant="outline">Achievement</Badge>
              <Badge variant="outline">Meditation</Badge>
              <Badge variant="outline">Focus</Badge>
            </div>
            <Button onClick={handleShare} disabled={!newPost.trim()}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Social Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={post.user.avatar} />
                  <AvatarFallback>{post.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{post.user.name}</h4>
                    <Badge variant="secondary" className="text-xs">Level {post.user.level}</Badge>
                    {getTypeIcon(post.type)}
                    <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                  </div>
                  
                  <p className="text-sm leading-relaxed">{post.content}</p>
                  
                  <div className="flex items-center gap-6 pt-2">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
