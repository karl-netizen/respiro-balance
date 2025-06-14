
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Hash } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { SocialPost } from '@/types/social';

interface CreatePostCardProps {
  onCreatePost: (content: string, postType: SocialPost['post_type']) => Promise<any>;
  isLoading?: boolean;
}

const CreatePostCard: React.FC<CreatePostCardProps> = ({
  onCreatePost,
  isLoading = false
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState<SocialPost['post_type']>('general');

  const postTypes: { type: SocialPost['post_type']; label: string; icon: string }[] = [
    { type: 'general', label: 'General', icon: '💬' },
    { type: 'achievement', label: 'Achievement', icon: '🏆' },
    { type: 'meditation', label: 'Meditation', icon: '🧘' },
    { type: 'focus', label: 'Focus', icon: '⚡' },
    { type: 'milestone', label: 'Milestone', icon: '🎯' },
    { type: 'challenge', label: 'Challenge', icon: '💪' }
  ];

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    await onCreatePost(content, selectedType);
    setContent('');
    setSelectedType('general');
  };

  if (!user) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please log in to share your wellness journey with the community.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Hash className="h-5 w-5" />
          <span>Share Your Wellness Journey</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>
              {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">
              {user?.user_metadata?.full_name || 'Your Name'}
            </p>
            <p className="text-xs text-muted-foreground">Share with the community</p>
          </div>
        </div>

        <Textarea
          placeholder="Share your wellness achievements, insights, or milestones..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px] resize-none"
          maxLength={280}
        />

        <div className="flex flex-wrap gap-2">
          {postTypes.map((type) => (
            <Badge
              key={type.type}
              variant={selectedType === type.type ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedType(type.type)}
            >
              <span className="mr-1">{type.icon}</span>
              {type.label}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {content.length}/280 characters
          </p>
          
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isLoading}
            className="flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePostCard;
