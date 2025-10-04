import { useState, useEffect } from 'react';
import { socialHubAPI } from '@/lib/api/socialHub';
import { supabase } from '@/integrations/supabase/client';
import type { SocialPost, Challenge, LeaderboardEntry, SocialNotification } from '@/types/social';

export function useSocialFeed(limit = 20) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');
        
        const data = await socialHubAPI.getFeed(user.id, limit);
        setPosts(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [limit]);

  const createPost = async (content: string, postType: SocialPost['post_type'] = 'general') => {
    const newPost = await socialHubAPI.createPost(content, postType);
    setPosts([newPost, ...posts]);
    return newPost;
  };

  const likePost = async (postId: string) => {
    await socialHubAPI.likePost(postId);
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes_count: post.likes_count + 1, user_liked: true }
        : post
    ));
  };

  const unlikePost = async (postId: string) => {
    await socialHubAPI.unlikePost(postId);
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes_count: post.likes_count - 1, user_liked: false }
        : post
    ));
  };

  const deletePost = async (postId: string) => {
    await socialHubAPI.deletePost(postId);
    setPosts(posts.filter(post => post.id !== postId));
  };

  return { posts, loading, error, createPost, likePost, unlikePost, deletePost };
}

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const data = await socialHubAPI.getActiveChallenges();
        setChallenges(data);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const joinChallenge = async (challengeId: string) => {
    await socialHubAPI.joinChallenge(challengeId);
    const data = await socialHubAPI.getActiveChallenges();
    setChallenges(data);
  };

  return { challenges, loading, joinChallenge };
}

export function useLeaderboard(
  period: 'weekly' | 'monthly' | 'all_time',
  category: string
) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await socialHubAPI.getLeaderboard(period, category);
        setEntries(data);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [period, category]);

  return { entries, loading };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<SocialNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const data = await socialHubAPI.getNotifications();
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Real-time subscription setup
    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const subscription = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'social_notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            setNotifications(prev => [payload.new as SocialNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
          }
        )
        .subscribe();

      return subscription;
    };

    let subscription: any;
    setupSubscription().then(sub => { subscription = sub; });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const markAsRead = async (notificationId: string) => {
    await socialHubAPI.markNotificationAsRead(notificationId);
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, is_read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    await socialHubAPI.markAllNotificationsAsRead();
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead };
}
