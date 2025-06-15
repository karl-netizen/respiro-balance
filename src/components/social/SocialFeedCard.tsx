
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, Clock } from 'lucide-react';
import type { SocialPost } from '@/types/social';

interface SocialFeedCardProps {
  post: SocialPost;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
}

const SocialFeedCard: React.FC<SocialFeedCardProps> = ({
  post,
  onLike,
  onComment,
  onShare
}) => {
  const getPostTypeIcon = (type: SocialPost['post_type']) => {
    switch (type) {
      case 'achievement': return '🏆';
      case 'meditation': return '🧘';
      case 'focus': return '⚡';
      case 'milestone': return '🎯';
      case 'challenge': return '💪';
      default: return '💬';
    }
  };

  const getPostTypeBadge = (type: SocialPost['post_type']) => {
    const colors = {
      achievement: 'bg-yellow-100 text-yellow-800',
      meditation: 'bg-purple-100 text-purple-800',
      focus: 'bg-orange-100 text-orange-800',
      milestone: 'bg-green-100 text-green-800',
      challenge: 'bg-blue-100 text-blue-800',
      general: 'bg-gray-100 text-gray-800'
    };
    
    return colors[type] || colors.general;
  };

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.user_profile?.avatar_url} />
              <AvatarFallback>
                {post.user_profile?.display_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-sm">
                  {post.user_profile?.display_name || 'Anonymous User'}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  Level {post.user_profile?.level || 1}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{timeAgo(post.created_at)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <span className="text-lg">{getPostTypeIcon(post.post_type)}</span>
            <Badge className={getPostTypeBadge(post.post_type)}>
              {post.post_type}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm mb-4 whitespace-pre-wrap">{post.content}</p>
        
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(post.id)}
              className={`flex items-center space-x-1 ${
                post.user_liked ? 'text-red-500' : 'text-muted-foreground'
              }`}
            >
              <Heart className={`h-4 w-4 text-red-500 ${post.user_liked ? 'fill-current' : ''}`} />
              <span>{post.likes_count}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment(post.id)}
              className="flex items-center space-x-1 text-muted-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments_count}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare(post.id)}
              className="flex items-center space-x-1 text-muted-foreground"
            >
              <Share2 className="h-4 w-4" />
              <span>{post.shares_count}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialFeedCard;
