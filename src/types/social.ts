
export interface UserSocialProfile {
  id: string;
  user_id: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  level: number;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  privacy_settings: {
    profile_visibility: 'public' | 'friends' | 'private';
    activity_visibility: 'public' | 'friends' | 'private';
    leaderboard_participation: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface SocialPost {
  id: string;
  user_id: string;
  content: string;
  post_type: 'general' | 'achievement' | 'milestone' | 'meditation' | 'focus' | 'challenge';
  metadata: Record<string, any>;
  privacy_level: 'public' | 'friends' | 'private';
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
  // Joined data
  user_profile?: UserSocialProfile;
  user_liked?: boolean;
}

export interface PostInteraction {
  id: string;
  user_id: string;
  post_id: string;
  interaction_type: 'like' | 'share' | 'report';
  created_at: string;
}

export interface PostComment {
  id: string;
  user_id: string;
  post_id: string;
  parent_comment_id?: string;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  // Joined data
  user_profile?: UserSocialProfile;
  replies?: PostComment[];
}

export interface UserFriendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  created_at: string;
  updated_at: string;
  // Joined data
  friend_profile?: UserSocialProfile;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description?: string;
  category: 'workplace_wellness' | 'daily_practice' | 'productivity' | 'advanced_practice' | 'beginner' | 'general';
  privacy_type: 'public' | 'private' | 'invite_only';
  member_count: number;
  activity_level: 'very_active' | 'active' | 'moderate' | 'low';
  created_by: string;
  group_image_url?: string;
  rules?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  user_membership?: GroupMembership;
}

export interface GroupMembership {
  id: string;
  user_id: string;
  group_id: string;
  role: 'admin' | 'moderator' | 'member';
  joined_at: string;
  last_active: string;
  // Joined data
  group?: CommunityGroup;
  user_profile?: UserSocialProfile;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  challenge_type: 'meditation' | 'focus' | 'streak' | 'community' | 'mixed';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  duration_days: number;
  start_date: string;
  end_date: string;
  participant_limit?: number;
  participant_count: number;
  completion_criteria: Record<string, any>;
  rewards: Record<string, any>;
  created_by?: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  // Joined data
  user_participation?: ChallengeParticipation;
}

export interface ChallengeParticipation {
  id: string;
  user_id: string;
  challenge_id: string;
  status: 'active' | 'completed' | 'failed' | 'withdrawn';
  progress: Record<string, any>;
  completion_date?: string;
  joined_at: string;
  // Joined data
  challenge?: CommunityChallenge;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  leaderboard_type: 'meditation_minutes' | 'focus_sessions' | 'current_streak' | 'weekly_points';
  time_period: 'weekly' | 'monthly' | 'all_time';
  score: number;
  rank?: number;
  period_start: string;
  period_end?: string;
  calculated_at: string;
  // Joined data
  user_profile?: UserSocialProfile;
}

export interface UserRewards {
  id: string;
  user_id: string;
  coin_balance: number;
  total_coins_earned: number;
  total_coins_spent: number;
  reward_inventory: any[];
  active_badges: any[];
  created_at: string;
  updated_at: string;
}

export interface RewardTransaction {
  id: string;
  user_id: string;
  transaction_type: 'earned' | 'spent' | 'bonus' | 'refund';
  amount: number;
  source: string;
  description?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface UserNotification {
  id: string;
  user_id: string;
  notification_type: 'achievement' | 'social' | 'challenge' | 'friend_request' | 'group_invite' | 'system';
  title: string;
  message: string;
  data: Record<string, any>;
  read_at?: string;
  created_at: string;
}

export interface SharedAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_data: Record<string, any>;
  share_message?: string;
  platform?: 'feed' | 'twitter' | 'facebook' | 'linkedin' | 'instagram';
  shared_at: string;
}
