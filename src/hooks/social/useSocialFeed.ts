
import { useState, useEffect } from 'react';
import { useSocialApi } from './useSocialApi';
import type { SocialPost } from '@/types/social';

export function useSocialFeed() {
  const { fetchSocialFeed, createPost, likePost, addComment, isLoading } = useSocialApi();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    
    try {
      const newPosts = await fetchSocialFeed(20, 0);
      setPosts(newPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      if (refresh) setRefreshing(false);
    }
  };

  const handleCreatePost = async (content: string, postType: SocialPost['post_type'] = 'general') => {
    const newPost = await createPost(content, postType);
    if (newPost) {
      // Add the new post to the top of the feed
      setPosts(prev => [newPost, ...prev]);
    }
    return newPost;
  };

  const handleLikePost = async (postId: string) => {
    const liked = await likePost(postId);
    
    // Optimistically update the UI
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes_count: liked ? post.likes_count + 1 : post.likes_count - 1,
          user_liked: liked
        };
      }
      return post;
    }));
    
    return liked;
  };

  const handleAddComment = async (postId: string, content: string) => {
    const comment = await addComment(postId, content);
    
    if (comment) {
      // Update the post's comment count
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments_count: post.comments_count + 1
          };
        }
        return post;
      }));
    }
    
    return comment;
  };

  const refreshFeed = () => {
    loadPosts(true);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return {
    posts,
    isLoading,
    refreshing,
    createPost: handleCreatePost,
    likePost: handleLikePost,
    addComment: handleAddComment,
    refreshFeed,
  };
}
