import { supabase } from '@/integrations/supabase/client';
import type { SocialPost, SocialComment, Friendship, Challenge, ChallengeParticipant, LeaderboardEntry, SocialNotification } from '@/types/social';

export class SocialHubAPI {
  
  // ========== POSTS ==========
  
  async getFeed(userId: string, limit = 20, offset = 0): Promise<SocialPost[]> {
    const { data, error } = await supabase
      .from('social_posts')
      .select(`
        *,
        user_profile:user_social_profiles!social_posts_user_id_fkey(*)
      `)
      .or(`privacy_level.eq.public,user_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Check if current user liked each post
    if (data) {
      const postIds = data.map(p => p.id);
      const { data: likes } = await supabase
        .from('social_likes')
        .select('post_id')
        .eq('user_id', userId)
        .in('post_id', postIds);

      const likedPostIds = new Set(likes?.map(l => l.post_id) || []);
      return data.map(post => ({
        ...post,
        user_liked: likedPostIds.has(post.id)
      })) as SocialPost[];
    }

    return [];
  }

  async createPost(content: string, postType: SocialPost['post_type'] = 'general'): Promise<SocialPost> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('social_posts')
      .insert([{
        user_id: user.id,
        content,
        post_type: postType,
        privacy_level: 'public'
      }])
      .select(`
        *,
        user_profile:user_social_profiles!social_posts_user_id_fkey(*)
      `)
      .single();

    if (error) throw error;
    return data as SocialPost;
  }

  async deletePost(postId: string): Promise<void> {
    const { error } = await supabase
      .from('social_posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;
  }

  // ========== LIKES ==========

  async likePost(postId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('social_likes')
      .insert([{ post_id: postId, user_id: user.id }]);

    if (error) throw error;
  }

  async unlikePost(postId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('social_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id);

    if (error) throw error;
  }

  // ========== COMMENTS ==========

  async getPostComments(postId: string): Promise<SocialComment[]> {
    const { data, error } = await supabase
      .from('social_comments')
      .select(`
        *,
        user_profile:user_social_profiles!social_comments_user_id_fkey(*)
      `)
      .eq('post_id', postId)
      .is('parent_comment_id', null)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as SocialComment[];
  }

  async createComment(postId: string, content: string, parentCommentId?: string): Promise<SocialComment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('social_comments')
      .insert([{
        post_id: postId,
        user_id: user.id,
        content,
        parent_comment_id: parentCommentId
      }])
      .select(`
        *,
        user_profile:user_social_profiles!social_comments_user_id_fkey(*)
      `)
      .single();

    if (error) throw error;
    return data as SocialComment;
  }

  async deleteComment(commentId: string): Promise<void> {
    const { error } = await supabase
      .from('social_comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
  }

  // ========== FRIENDSHIPS ==========

  async sendFriendRequest(friendId: string): Promise<Friendship> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('friendships')
      .insert([{ user_id: user.id, friend_id: friendId, status: 'pending' }])
      .select()
      .single();

    if (error) throw error;
    return data as Friendship;
  }

  async acceptFriendRequest(friendshipId: string): Promise<Friendship> {
    const { data, error } = await supabase
      .from('friendships')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', friendshipId)
      .select()
      .single();

    if (error) throw error;
    return data as Friendship;
  }

  async getFriends(userId: string): Promise<Friendship[]> {
    const { data, error } = await supabase
      .from('friendships')
      .select('*')
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
      .eq('status', 'accepted');

    if (error) throw error;
    return data as Friendship[];
  }

  // ========== CHALLENGES ==========

  async getActiveChallenges(): Promise<Challenge[]> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_active', true)
      .lte('start_date', now)
      .gte('end_date', now)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data as Challenge[];
  }

  async joinChallenge(challengeId: string): Promise<ChallengeParticipant> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('challenge_participants_new')
      .insert([{ challenge_id: challengeId, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data as ChallengeParticipant;
  }

  /**
   * Update challenge progress using secure RPC function
   * Prevents manipulation by validating increments server-side
   * @param challengeId - The challenge to update
   * @param progressIncrement - Amount to increment (not absolute value)
   * @param metadata - Optional metadata (e.g., meditation_session_id)
   */
  async updateChallengeProgress(
    challengeId: string,
    progressIncrement: number,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; old_progress: number; new_progress: number; is_completed: boolean }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Call secure RPC function instead of direct update
    const { data, error } = await supabase.rpc('update_challenge_progress', {
      p_challenge_id: challengeId,
      p_progress_increment: progressIncrement,
      p_metadata: metadata || null
    });

    if (error) throw error;
    return data;
  }

  /**
   * Reset challenge progress (for retrying)
   * @param challengeId - The challenge to reset
   */
  async resetChallengeProgress(challengeId: string): Promise<{ success: boolean; reset_count: number }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase.rpc('reset_challenge_progress', {
      p_challenge_id: challengeId,
      p_user_id: user.id
    });

    if (error) throw error;
    return data;
  }

  // ========== LEADERBOARDS ==========

  async getLeaderboard(
    period: 'weekly' | 'monthly' | 'all_time',
    category: string,
    limit = 50
  ): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabase
      .from('leaderboard_entries')
      .select(`
        *,
        user_profile:user_social_profiles!leaderboard_entries_user_id_fkey(*)
      `)
      .eq('time_period', period)
      .eq('leaderboard_type', category)
      .order('rank', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data as LeaderboardEntry[];
  }

  // ========== NOTIFICATIONS ==========

  async getNotifications(unreadOnly = false): Promise<SocialNotification[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    let query = supabase
      .from('social_notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as SocialNotification[];
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('social_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  }

  async markAllNotificationsAsRead(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('social_notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) throw error;
  }
}

export const socialHubAPI = new SocialHubAPI();
