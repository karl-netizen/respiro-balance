
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type {
  SocialPost,
  PostComment,
  CommunityGroup,
  CommunityChallenge,
  LeaderboardEntry,
  UserSocialProfile,
  UserRewards
} from '@/types/social';

export function useSocialApi() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Social Posts API
  const fetchSocialFeed = async (limit = 20, offset = 0): Promise<SocialPost[]> => {
    if (!user) return [];
    
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('social_posts')
        .select(`
          *,
          user_social_profiles!inner(
            display_name,
            avatar_url,
            level
          )
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch social feed';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (content: string, postType: SocialPost['post_type'] = 'general', metadata = {}): Promise<SocialPost | null> => {
    if (!user) {
      toast.error('You must be logged in to create posts');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('social_posts')
        .insert({
          user_id: user.id,
          content,
          post_type: postType,
          metadata,
          privacy_level: 'public'
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Post shared successfully!');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create post';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const likePost = async (postId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);

      // Check if already liked
      const { data: existing } = await supabase
        .from('post_interactions')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .eq('interaction_type', 'like')
        .single();

      if (existing) {
        // Unlike
        const { error } = await supabase
          .from('post_interactions')
          .delete()
          .eq('id', existing.id);
        
        if (error) throw error;
        return false;
      } else {
        // Like
        const { error } = await supabase
          .from('post_interactions')
          .insert({
            user_id: user.id,
            post_id: postId,
            interaction_type: 'like'
          });
        
        if (error) throw error;
        return true;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update like';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
      return false;
    }
  };

  const addComment = async (postId: string, content: string, parentCommentId?: string): Promise<PostComment | null> => {
    if (!user) return null;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          user_id: user.id,
          post_id: postId,
          content,
          parent_comment_id: parentCommentId || null
        })
        .select(`
          *,
          user_social_profiles!inner(
            display_name,
            avatar_url,
            level
          )
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add comment';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Leaderboards API
  const fetchLeaderboard = async (
    type: LeaderboardEntry['leaderboard_type'],
    period: LeaderboardEntry['time_period'] = 'weekly'
  ): Promise<LeaderboardEntry[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('leaderboard_entries')
        .select(`
          *,
          user_social_profiles!inner(
            display_name,
            avatar_url,
            level
          )
        `)
        .eq('leaderboard_type', type)
        .eq('time_period', period)
        .order('score', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch leaderboard';
      setError(new Error(errorMessage));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Challenges API
  const fetchChallenges = async (status?: CommunityChallenge['status']): Promise<CommunityChallenge[]> => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('community_challenges')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch challenges';
      setError(new Error(errorMessage));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const joinChallenge = async (challengeId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('challenge_participations')
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
          status: 'active'
        });

      if (error) throw error;
      toast.success('Successfully joined challenge!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join challenge';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Groups API
  const fetchGroups = async (): Promise<CommunityGroup[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('community_groups')
        .select('*')
        .eq('privacy_type', 'public')
        .order('member_count', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch groups';
      setError(new Error(errorMessage));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const joinGroup = async (groupId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('group_memberships')
        .insert({
          user_id: user.id,
          group_id: groupId,
          role: 'member'
        });

      if (error) throw error;
      toast.success('Successfully joined group!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join group';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // User Profile API
  const fetchUserProfile = async (userId?: string): Promise<UserSocialProfile | null> => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return null;

    try {
      setError(null);

      const { data, error } = await supabase
        .from('user_social_profiles')
        .select('*')
        .eq('user_id', targetUserId)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      return null;
    }
  };

  const updateUserProfile = async (updates: Partial<UserSocialProfile>): Promise<boolean> => {
    if (!user) return false;

    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('user_social_profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Profile updated successfully!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Rewards API
  const fetchUserRewards = async (): Promise<UserRewards | null> => {
    if (!user) return null;

    try {
      setError(null);

      const { data, error } = await supabase
        .from('user_rewards')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Failed to fetch user rewards:', err);
      return null;
    }
  };

  return {
    isLoading,
    error,
    // Posts
    fetchSocialFeed,
    createPost,
    likePost,
    addComment,
    // Leaderboards
    fetchLeaderboard,
    // Challenges
    fetchChallenges,
    joinChallenge,
    // Groups
    fetchGroups,
    joinGroup,
    // Profile
    fetchUserProfile,
    updateUserProfile,
    // Rewards
    fetchUserRewards,
  };
}
