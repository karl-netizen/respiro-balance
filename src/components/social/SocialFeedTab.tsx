
import React from 'react';
import { useSocialFeed } from '@/hooks/social/useSocialFeed';
import CreatePostCard from './CreatePostCard';
import SocialFeedCard from './SocialFeedCard';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const SocialFeedTab: React.FC = () => {
  const {
    posts,
    isLoading,
    refreshing,
    createPost,
    likePost,
    addComment,
    refreshFeed
  } = useSocialFeed();

  const handleComment = (postId: string) => {
    // This would open a comment dialog
    console.log('Comment on post:', postId);
  };

  const handleShare = (postId: string) => {
    // This would open a share dialog
    console.log('Share post:', postId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Community Feed</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshFeed}
          disabled={refreshing}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      <CreatePostCard onCreatePost={createPost} isLoading={isLoading} />

      <div className="space-y-4">
        {posts.length === 0 && !isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No posts yet. Be the first to share your wellness journey!</p>
          </div>
        ) : (
          posts.map((post) => (
            <SocialFeedCard
              key={post.id}
              post={post}
              onLike={likePost}
              onComment={handleComment}
              onShare={handleShare}
            />
          ))
        )}
      </div>

      {isLoading && posts.length === 0 && (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading community feed...</p>
        </div>
      )}
    </div>
  );
};

export default SocialFeedTab;
