-- ============================================
-- SOCIAL HUB BACKEND - Database Schema
-- ============================================

-- Create social_likes table (simpler than post_interactions)
CREATE TABLE IF NOT EXISTS social_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_social_likes_post_id ON social_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_social_likes_user_id ON social_likes(user_id);

-- Create social_comments table (cleaner than post_comments)
CREATE TABLE IF NOT EXISTS social_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES social_comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_comments_post_id ON social_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_social_comments_user_id ON social_comments(user_id);

-- Create friendships table (simpler than user_friendships)
CREATE TABLE IF NOT EXISTS friendships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  friend_id UUID NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

CREATE INDEX IF NOT EXISTS idx_friendships_user_id ON friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status);

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  challenge_type VARCHAR(50) NOT NULL,
  category VARCHAR(50),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  target_metric VARCHAR(50),
  target_value INTEGER,
  participants_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_challenges_active ON challenges(is_active, start_date);
CREATE INDEX IF NOT EXISTS idx_challenges_type ON challenges(challenge_type);

-- Create challenge_participants_new table
CREATE TABLE IF NOT EXISTS challenge_participants_new (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_challenge_participants_challenge ON challenge_participants_new(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user ON challenge_participants_new(user_id);

-- Create social_notifications table
CREATE TABLE IF NOT EXISTS social_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  action_url TEXT,
  related_user_id UUID,
  related_post_id UUID REFERENCES social_posts(id),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_notifications_user ON social_notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_social_notifications_created ON social_notifications(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

ALTER TABLE social_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_notifications ENABLE ROW LEVEL SECURITY;

-- Social Likes Policies
CREATE POLICY "Anyone can view likes"
  ON social_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can like posts"
  ON social_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON social_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Social Comments Policies
CREATE POLICY "Anyone can view comments"
  ON social_comments FOR SELECT
  USING (true);

CREATE POLICY "Users can create comments"
  ON social_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON social_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON social_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Friendships Policies
CREATE POLICY "Users can view their friendships"
  ON friendships FOR SELECT
  USING (user_id = auth.uid() OR friend_id = auth.uid());

CREATE POLICY "Users can create friend requests"
  ON friendships FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update friendships"
  ON friendships FOR UPDATE
  USING (user_id = auth.uid() OR friend_id = auth.uid());

-- Challenges Policies
CREATE POLICY "Anyone can view active challenges"
  ON challenges FOR SELECT
  USING (is_active = true);

-- Challenge Participants Policies
CREATE POLICY "Users can view challenge participants"
  ON challenge_participants_new FOR SELECT
  USING (true);

CREATE POLICY "Users can join challenges"
  ON challenge_participants_new FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own participation"
  ON challenge_participants_new FOR UPDATE
  USING (user_id = auth.uid());

-- Social Notifications Policies
CREATE POLICY "Users can view their own notifications"
  ON social_notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON social_notifications FOR UPDATE
  USING (user_id = auth.uid());

-- ============================================
-- DATABASE FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update post likes count
CREATE OR REPLACE FUNCTION update_social_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE social_posts 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE social_posts 
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_update_social_post_likes ON social_likes;
CREATE TRIGGER trigger_update_social_post_likes
AFTER INSERT OR DELETE ON social_likes
FOR EACH ROW EXECUTE FUNCTION update_social_post_likes_count();

-- Function to update post comments count
CREATE OR REPLACE FUNCTION update_social_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE social_posts 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE social_posts 
    SET comments_count = GREATEST(0, comments_count - 1)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_update_social_post_comments ON social_comments;
CREATE TRIGGER trigger_update_social_post_comments
AFTER INSERT OR DELETE ON social_comments
FOR EACH ROW EXECUTE FUNCTION update_social_post_comments_count();

-- Function to update challenge participants count
CREATE OR REPLACE FUNCTION update_challenge_participants_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE challenges 
    SET participants_count = participants_count + 1 
    WHERE id = NEW.challenge_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE challenges 
    SET participants_count = GREATEST(0, participants_count - 1)
    WHERE id = OLD.challenge_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_update_challenge_participants ON challenge_participants_new;
CREATE TRIGGER trigger_update_challenge_participants
AFTER INSERT OR DELETE ON challenge_participants_new
FOR EACH ROW EXECUTE FUNCTION update_challenge_participants_count();

-- Function to create notification on like
CREATE OR REPLACE FUNCTION create_like_notification()
RETURNS TRIGGER AS $$
DECLARE
  post_author_id UUID;
BEGIN
  SELECT user_id INTO post_author_id FROM social_posts WHERE id = NEW.post_id;
  
  IF post_author_id != NEW.user_id THEN
    INSERT INTO social_notifications (user_id, type, title, related_user_id, related_post_id)
    VALUES (
      post_author_id,
      'like',
      'Someone liked your post',
      NEW.user_id,
      NEW.post_id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_create_like_notification ON social_likes;
CREATE TRIGGER trigger_create_like_notification
AFTER INSERT ON social_likes
FOR EACH ROW EXECUTE FUNCTION create_like_notification();

-- Function to create notification on comment
CREATE OR REPLACE FUNCTION create_comment_notification()
RETURNS TRIGGER AS $$
DECLARE
  post_author_id UUID;
BEGIN
  SELECT user_id INTO post_author_id FROM social_posts WHERE id = NEW.post_id;
  
  IF post_author_id != NEW.user_id THEN
    INSERT INTO social_notifications (user_id, type, title, related_user_id, related_post_id)
    VALUES (
      post_author_id,
      'comment',
      'Someone commented on your post',
      NEW.user_id,
      NEW.post_id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_create_comment_notification ON social_comments;
CREATE TRIGGER trigger_create_comment_notification
AFTER INSERT ON social_comments
FOR EACH ROW EXECUTE FUNCTION create_comment_notification();