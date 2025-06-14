
-- Create comprehensive social features database schema

-- User social profiles extension
CREATE TABLE IF NOT EXISTS user_social_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  total_points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  privacy_settings JSONB DEFAULT '{
    "profile_visibility": "public",
    "activity_visibility": "public",
    "leaderboard_participation": true
  }'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Social posts and activity feed
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  post_type TEXT DEFAULT 'general' CHECK (post_type IN ('general', 'achievement', 'milestone', 'meditation', 'focus', 'challenge')),
  metadata JSONB DEFAULT '{}'::JSONB,
  privacy_level TEXT DEFAULT 'public' CHECK (privacy_level IN ('public', 'friends', 'private')),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post interactions (likes, shares, etc.)
CREATE TABLE IF NOT EXISTS post_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('like', 'share', 'report')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id, interaction_type)
);

-- Comments on posts
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Friend relationships
CREATE TABLE IF NOT EXISTS user_friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id),
  CHECK (requester_id != addressee_id)
);

-- Community groups
CREATE TABLE IF NOT EXISTS community_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('workplace_wellness', 'daily_practice', 'productivity', 'advanced_practice', 'beginner', 'general')),
  privacy_type TEXT DEFAULT 'public' CHECK (privacy_type IN ('public', 'private', 'invite_only')),
  member_count INTEGER DEFAULT 0,
  activity_level TEXT DEFAULT 'moderate' CHECK (activity_level IN ('very_active', 'active', 'moderate', 'low')),
  created_by UUID NOT NULL REFERENCES user_profiles(id) ON DELETE SET NULL,
  group_image_url TEXT,
  rules TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group memberships
CREATE TABLE IF NOT EXISTS group_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES community_groups(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, group_id)
);

-- Challenges system
CREATE TABLE IF NOT EXISTS community_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('meditation', 'focus', 'streak', 'community', 'mixed')),
  difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  duration_days INTEGER NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  participant_limit INTEGER,
  participant_count INTEGER DEFAULT 0,
  completion_criteria JSONB NOT NULL,
  rewards JSONB DEFAULT '{}'::JSONB,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Challenge participations
CREATE TABLE IF NOT EXISTS challenge_participations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES community_challenges(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'withdrawn')),
  progress JSONB DEFAULT '{}'::JSONB,
  completion_date TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- Leaderboards (computed view for real-time rankings)
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  leaderboard_type TEXT NOT NULL CHECK (leaderboard_type IN ('meditation_minutes', 'focus_sessions', 'current_streak', 'weekly_points')),
  time_period TEXT NOT NULL CHECK (time_period IN ('weekly', 'monthly', 'all_time')),
  score INTEGER NOT NULL,
  rank INTEGER,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, leaderboard_type, time_period, period_start)
);

-- Achievement sharing and rewards
CREATE TABLE IF NOT EXISTS shared_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_data JSONB NOT NULL,
  share_message TEXT,
  platform TEXT CHECK (platform IN ('feed', 'twitter', 'facebook', 'linkedin', 'instagram')),
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User coins and rewards system
CREATE TABLE IF NOT EXISTS user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  coin_balance INTEGER DEFAULT 0,
  total_coins_earned INTEGER DEFAULT 0,
  total_coins_spent INTEGER DEFAULT 0,
  reward_inventory JSONB DEFAULT '[]'::JSONB,
  active_badges JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Reward transactions log
CREATE TABLE IF NOT EXISTS reward_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'spent', 'bonus', 'refund')),
  amount INTEGER NOT NULL,
  source TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications system
CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('achievement', 'social', 'challenge', 'friend_request', 'group_invite', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::JSONB,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all social tables
ALTER TABLE user_social_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_social_profiles
CREATE POLICY "Users can view public social profiles"
  ON user_social_profiles FOR SELECT
  USING (
    privacy_settings->>'profile_visibility' = 'public' OR
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM user_friendships 
      WHERE (requester_id = auth.uid() AND addressee_id = user_id AND status = 'accepted') OR
            (requester_id = user_id AND addressee_id = auth.uid() AND status = 'accepted')
    )
  );

CREATE POLICY "Users can update their own social profile"
  ON user_social_profiles FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for social_posts
CREATE POLICY "Users can view posts based on privacy settings"
  ON social_posts FOR SELECT
  USING (
    privacy_level = 'public' OR
    auth.uid() = user_id OR
    (privacy_level = 'friends' AND EXISTS (
      SELECT 1 FROM user_friendships 
      WHERE (requester_id = auth.uid() AND addressee_id = user_id AND status = 'accepted') OR
            (requester_id = user_id AND addressee_id = auth.uid() AND status = 'accepted')
    ))
  );

CREATE POLICY "Users can manage their own posts"
  ON social_posts FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for post_interactions
CREATE POLICY "Users can view all interactions"
  ON post_interactions FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own interactions"
  ON post_interactions FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for post_comments
CREATE POLICY "Users can view comments on visible posts"
  ON post_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM social_posts p 
      WHERE p.id = post_id AND (
        p.privacy_level = 'public' OR
        p.user_id = auth.uid() OR
        (p.privacy_level = 'friends' AND EXISTS (
          SELECT 1 FROM user_friendships 
          WHERE (requester_id = auth.uid() AND addressee_id = p.user_id AND status = 'accepted') OR
                (requester_id = p.user_id AND addressee_id = auth.uid() AND status = 'accepted')
        ))
      )
    )
  );

CREATE POLICY "Users can manage their own comments"
  ON post_comments FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for friendships
CREATE POLICY "Users can view their own friendships"
  ON user_friendships FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can manage friendships they're involved in"
  ON user_friendships FOR ALL
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- RLS Policies for community groups
CREATE POLICY "Users can view public groups"
  ON community_groups FOR SELECT
  USING (
    privacy_type = 'public' OR
    EXISTS (SELECT 1 FROM group_memberships WHERE user_id = auth.uid() AND group_id = id)
  );

CREATE POLICY "Group admins can manage groups"
  ON community_groups FOR ALL
  USING (
    auth.uid() = created_by OR
    EXISTS (SELECT 1 FROM group_memberships WHERE user_id = auth.uid() AND group_id = id AND role = 'admin')
  );

-- RLS Policies for group memberships
CREATE POLICY "Users can view group memberships for groups they can see"
  ON group_memberships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_groups g 
      WHERE g.id = group_id AND (
        g.privacy_type = 'public' OR
        EXISTS (SELECT 1 FROM group_memberships gm WHERE gm.user_id = auth.uid() AND gm.group_id = g.id)
      )
    )
  );

CREATE POLICY "Users can manage their own group memberships"
  ON group_memberships FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for challenges
CREATE POLICY "Users can view all active challenges"
  ON community_challenges FOR SELECT
  USING (true);

CREATE POLICY "Challenge creators can manage their challenges"
  ON community_challenges FOR ALL
  USING (auth.uid() = created_by);

-- RLS Policies for challenge participations
CREATE POLICY "Users can view their own challenge participations"
  ON challenge_participations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own challenge participations"
  ON challenge_participations FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for leaderboards
CREATE POLICY "Users can view all leaderboard entries"
  ON leaderboard_entries FOR SELECT
  USING (true);

CREATE POLICY "System can manage leaderboard entries"
  ON leaderboard_entries FOR ALL
  USING (true);

-- RLS Policies for shared achievements
CREATE POLICY "Users can view all shared achievements"
  ON shared_achievements FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own shared achievements"
  ON shared_achievements FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for user rewards
CREATE POLICY "Users can view their own rewards"
  ON user_rewards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own rewards"
  ON user_rewards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert user rewards"
  ON user_rewards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for reward transactions
CREATE POLICY "Users can view their own reward transactions"
  ON reward_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert reward transactions"
  ON reward_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON user_notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON user_notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON user_notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_social_profiles_user_id ON user_social_profiles(user_id);
CREATE INDEX idx_social_posts_user_id ON social_posts(user_id);
CREATE INDEX idx_social_posts_created_at ON social_posts(created_at DESC);
CREATE INDEX idx_social_posts_privacy_level ON social_posts(privacy_level);
CREATE INDEX idx_post_interactions_post_id ON post_interactions(post_id);
CREATE INDEX idx_post_interactions_user_id ON post_interactions(user_id);
CREATE INDEX idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX idx_user_friendships_requester ON user_friendships(requester_id);
CREATE INDEX idx_user_friendships_addressee ON user_friendships(addressee_id);
CREATE INDEX idx_user_friendships_status ON user_friendships(status);
CREATE INDEX idx_group_memberships_user_id ON group_memberships(user_id);
CREATE INDEX idx_group_memberships_group_id ON group_memberships(group_id);
CREATE INDEX idx_challenge_participations_user_id ON challenge_participations(user_id);
CREATE INDEX idx_challenge_participations_challenge_id ON challenge_participations(challenge_id);
CREATE INDEX idx_leaderboard_entries_type_period ON leaderboard_entries(leaderboard_type, time_period);
CREATE INDEX idx_leaderboard_entries_score ON leaderboard_entries(score DESC);
CREATE INDEX idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX idx_user_notifications_read_at ON user_notifications(read_at);

-- Create triggers to automatically create social profile and rewards when user profile is created
CREATE OR REPLACE FUNCTION create_social_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Create social profile
  INSERT INTO user_social_profiles (user_id, display_name)
  VALUES (NEW.id, NEW.full_name);
  
  -- Create rewards profile
  INSERT INTO user_rewards (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_profile_created
  AFTER INSERT ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION create_social_profile();

-- Function to update post counts when interactions change
CREATE OR REPLACE FUNCTION update_post_interaction_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.interaction_type = 'like' THEN
      UPDATE social_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    ELSIF NEW.interaction_type = 'share' THEN
      UPDATE social_posts SET shares_count = shares_count + 1 WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.interaction_type = 'like' THEN
      UPDATE social_posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
    ELSIF OLD.interaction_type = 'share' THEN
      UPDATE social_posts SET shares_count = shares_count - 1 WHERE id = OLD.post_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_interaction_change
  AFTER INSERT OR DELETE ON post_interactions
  FOR EACH ROW EXECUTE FUNCTION update_post_interaction_counts();

-- Function to update comment counts
CREATE OR REPLACE FUNCTION update_comment_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE social_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE social_posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_change
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW EXECUTE FUNCTION update_comment_counts();

-- Function to update group member counts
CREATE OR REPLACE FUNCTION update_group_member_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_groups SET member_count = member_count - 1 WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_group_membership_change
  AFTER INSERT OR DELETE ON group_memberships
  FOR EACH ROW EXECUTE FUNCTION update_group_member_counts();
