
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
    <div className="space-y-4 sm:space-y-6">
      {/* Share New Post */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Share Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <Textarea
            placeholder="Share your wellness achievements, insights, or milestones..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
          />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <Badge variant="outline" className="text-xs">Achievement</Badge>
              <Badge variant="outline" className="text-xs">Meditation</Badge>
              <Badge variant="outline" className="text-xs">Focus</Badge>
            </div>
            <Button onClick={handleShare} disabled={!newPost.trim()} size="sm" className="w-full sm:w-auto">
              <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span className="text-sm">Share</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Social Feed */}
      <div className="space-y-3 sm:space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage src={post.user.avatar} />
                  <AvatarFallback className="text-xs sm:text-sm">{post.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-sm sm:text-base truncate">{post.user.name}</h4>
                      <Badge variant="secondary" className="text-xs">Level {post.user.level}</Badge>
                      {getTypeIcon(post.type)}
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">{post.timestamp}</span>
                  </div>
                  
                  <p className="text-sm sm:text-base leading-relaxed break-words">{post.content}</p>
                  
                  <div className="flex items-center gap-3 sm:gap-6 pt-1 sm:pt-2">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 sm:gap-2 h-auto p-1 sm:p-2">
                      <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      <span className="text-xs sm:text-sm">{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 sm:gap-2 h-auto p-1 sm:p-2">
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">{post.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 sm:gap-2 h-auto p-1 sm:p-2">
                      <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">Share</span>
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
