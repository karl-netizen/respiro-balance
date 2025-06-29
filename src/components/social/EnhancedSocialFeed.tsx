
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, Trophy, Users, Send } from 'lucide-react';
import { TouchOptimized, SwipeGesture } from '@/components/mobile/MobileEnhancements';
import { InlineError } from '@/components/error/ErrorDisplay';
import { EnhancedLoadingState } from '@/components/ui/enhanced-loading-states';

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
  shares: number;
  isLiked: boolean;
  isBookmarked?: boolean;
}

interface EnhancedSocialFeedProps {
  posts?: SocialPost[];
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
  onCreatePost?: (content: string, type: string) => void;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
}

export const EnhancedSocialFeed: React.FC<EnhancedSocialFeedProps> = ({
  posts = [],
  loading = false,
  error,
  onRefresh,
  onCreatePost,
  onLike,
  onComment,
  onShare,
  onBookmark
}) => {
  const [newPost, setNewPost] = useState('');
  const [selectedType, setSelectedType] = useState('general');
  const [isPosting, setIsPosting] = useState(false);

  const handleCreatePost = useCallback(async () => {
    if (!newPost.trim() || !onCreatePost) return;
    
    setIsPosting(true);
    try {
      await onCreatePost(newPost, selectedType);
      setNewPost('');
      setSelectedType('general');
    } finally {
      setIsPosting(false);
    }
  }, [newPost, selectedType, onCreatePost]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'focus':
        return <Users className="h-4 w-4 text-orange-500" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <EnhancedLoadingState variant="social" />;
  }

  if (error) {
    return (
      <InlineError 
        message={error} 
        onRetry={onRefresh}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Post Section */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <Textarea
            placeholder="Share your wellness journey, achievements, or insights..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {['general', 'achievement', 'meditation', 'focus'].map((type) => (
                <TouchOptimized key={type}>
                  <Badge
                    variant={selectedType === type ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedType(type)}
                  >
                    {getTypeIcon(type)}
                    <span className="ml-1 capitalize">{type}</span>
                  </Badge>
                </TouchOptimized>
              ))}
            </div>
            
            <Button 
              onClick={handleCreatePost} 
              disabled={!newPost.trim() || isPosting}
              size="sm"
            >
              <Send className="h-4 w-4 mr-2" />
              {isPosting ? 'Posting...' : 'Share'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground">
                Be the first to share your wellness journey!
              </p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <SwipeGesture
              key={post.id}
              onSwipeLeft={() => onBookmark?.(post.id)}
              onSwipeRight={() => onLike?.(post.id)}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.user.avatar} />
                      <AvatarFallback>
                        {post.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{post.user.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          Level {post.user.level}
                        </Badge>
                        {getTypeIcon(post.type)}
                      </div>
                      <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <TouchOptimized onTap={() => onLike?.(post.id)} hapticFeedback>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                          <span className="text-xs">{post.likes}</span>
                        </Button>
                      </TouchOptimized>
                      
                      <TouchOptimized onTap={() => onComment?.(post.id)} hapticFeedback>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-xs">{post.comments}</span>
                        </Button>
                      </TouchOptimized>
                      
                      <TouchOptimized onTap={() => onShare?.(post.id)} hapticFeedback>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <Share2 className="h-4 w-4" />
                          <span className="text-xs">{post.shares}</span>
                        </Button>
                      </TouchOptimized>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Swipe ← to bookmark, → to like
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SwipeGesture>
          ))
        )}
      </div>
    </div>
  );
};
