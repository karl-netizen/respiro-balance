export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      biometric_data: {
        Row: {
          coherence: number | null
          device_source: string | null
          heart_rate: number | null
          hrv: number | null
          id: string
          raw_data: Json | null
          recorded_at: string | null
          respiratory_rate: number | null
          session_id: string | null
          stress_score: number | null
          user_id: string
        }
        Insert: {
          coherence?: number | null
          device_source?: string | null
          heart_rate?: number | null
          hrv?: number | null
          id?: string
          raw_data?: Json | null
          recorded_at?: string | null
          respiratory_rate?: number | null
          session_id?: string | null
          stress_score?: number | null
          user_id: string
        }
        Update: {
          coherence?: number | null
          device_source?: string | null
          heart_rate?: number | null
          hrv?: number | null
          id?: string
          raw_data?: Json | null
          recorded_at?: string | null
          respiratory_rate?: number | null
          session_id?: string | null
          stress_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "biometric_data_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "meditation_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "biometric_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_participations: {
        Row: {
          challenge_id: string
          completion_date: string | null
          id: string
          joined_at: string | null
          progress: Json | null
          status: string | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          completion_date?: string | null
          id?: string
          joined_at?: string | null
          progress?: Json | null
          status?: string | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          completion_date?: string | null
          id?: string
          joined_at?: string | null
          progress?: Json | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participations_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "community_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_participations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_challenges: {
        Row: {
          challenge_type: string
          completion_criteria: Json
          created_at: string | null
          created_by: string | null
          description: string
          difficulty_level: string | null
          duration_days: number
          end_date: string
          id: string
          participant_count: number | null
          participant_limit: number | null
          rewards: Json | null
          start_date: string
          status: string | null
          title: string
        }
        Insert: {
          challenge_type: string
          completion_criteria: Json
          created_at?: string | null
          created_by?: string | null
          description: string
          difficulty_level?: string | null
          duration_days: number
          end_date: string
          id?: string
          participant_count?: number | null
          participant_limit?: number | null
          rewards?: Json | null
          start_date: string
          status?: string | null
          title: string
        }
        Update: {
          challenge_type?: string
          completion_criteria?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string
          difficulty_level?: string | null
          duration_days?: number
          end_date?: string
          id?: string
          participant_count?: number | null
          participant_limit?: number | null
          rewards?: Json | null
          start_date?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_challenges_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_groups: {
        Row: {
          activity_level: string | null
          category: string
          created_at: string | null
          created_by: string
          description: string | null
          group_image_url: string | null
          id: string
          member_count: number | null
          name: string
          privacy_type: string | null
          rules: string | null
          updated_at: string | null
        }
        Insert: {
          activity_level?: string | null
          category: string
          created_at?: string | null
          created_by: string
          description?: string | null
          group_image_url?: string | null
          id?: string
          member_count?: number | null
          name: string
          privacy_type?: string | null
          rules?: string | null
          updated_at?: string | null
        }
        Update: {
          activity_level?: string | null
          category?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          group_image_url?: string | null
          id?: string
          member_count?: number | null
          name?: string
          privacy_type?: string | null
          rules?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      focus_achievements: {
        Row: {
          achievement_key: string
          created_at: string
          id: string
          progress: number | null
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_key: string
          created_at?: string
          id?: string
          progress?: number | null
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_key?: string
          created_at?: string
          id?: string
          progress?: number | null
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      focus_sessions: {
        Row: {
          break_intervals: number | null
          completed: boolean | null
          created_at: string
          distractions: number | null
          duration: number | null
          end_time: string | null
          focus_score: number | null
          id: string
          notes: string | null
          start_time: string
          tags: string[] | null
          user_id: string
          work_intervals: number | null
        }
        Insert: {
          break_intervals?: number | null
          completed?: boolean | null
          created_at?: string
          distractions?: number | null
          duration?: number | null
          end_time?: string | null
          focus_score?: number | null
          id?: string
          notes?: string | null
          start_time?: string
          tags?: string[] | null
          user_id: string
          work_intervals?: number | null
        }
        Update: {
          break_intervals?: number | null
          completed?: boolean | null
          created_at?: string
          distractions?: number | null
          duration?: number | null
          end_time?: string | null
          focus_score?: number | null
          id?: string
          notes?: string | null
          start_time?: string
          tags?: string[] | null
          user_id?: string
          work_intervals?: number | null
        }
        Relationships: []
      }
      group_memberships: {
        Row: {
          group_id: string
          id: string
          joined_at: string | null
          last_active: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string | null
          last_active?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string | null
          last_active?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_memberships_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_entries: {
        Row: {
          calculated_at: string | null
          id: string
          leaderboard_type: string
          period_end: string | null
          period_start: string
          rank: number | null
          score: number
          time_period: string
          user_id: string
        }
        Insert: {
          calculated_at?: string | null
          id?: string
          leaderboard_type: string
          period_end?: string | null
          period_start: string
          rank?: number | null
          score: number
          time_period: string
          user_id: string
        }
        Update: {
          calculated_at?: string | null
          id?: string
          leaderboard_type?: string
          period_end?: string | null
          period_start?: string
          rank?: number | null
          score?: number
          time_period?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meditation_sessions: {
        Row: {
          category: string | null
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          duration: number
          favorite: boolean | null
          feedback: string | null
          id: string
          image_url: string | null
          instructor: string | null
          level: string | null
          rating: number | null
          session_type: string
          started_at: string | null
          tags: string[] | null
          title: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration: number
          favorite?: boolean | null
          feedback?: string | null
          id?: string
          image_url?: string | null
          instructor?: string | null
          level?: string | null
          rating?: number | null
          session_type: string
          started_at?: string | null
          tags?: string[] | null
          title?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: number
          favorite?: boolean | null
          feedback?: string | null
          id?: string
          image_url?: string | null
          instructor?: string | null
          level?: string | null
          rating?: number | null
          session_type?: string
          started_at?: string | null
          tags?: string[] | null
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meditation_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      morning_rituals: {
        Row: {
          created_at: string | null
          days_of_week: string[] | null
          description: string | null
          duration: number
          id: string
          last_completed: string | null
          priority: string | null
          recurrence: string
          reminder_enabled: boolean | null
          reminder_time: number | null
          start_time: string
          status: string | null
          streak: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          days_of_week?: string[] | null
          description?: string | null
          duration: number
          id?: string
          last_completed?: string | null
          priority?: string | null
          recurrence: string
          reminder_enabled?: boolean | null
          reminder_time?: number | null
          start_time: string
          status?: string | null
          streak?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          days_of_week?: string[] | null
          description?: string | null
          duration?: number
          id?: string
          last_completed?: string | null
          priority?: string | null
          recurrence?: string
          reminder_enabled?: boolean | null
          reminder_time?: number | null
          start_time?: string
          status?: string | null
          streak?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "morning_rituals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          likes_count: number | null
          parent_comment_id: string | null
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_interactions: {
        Row: {
          created_at: string | null
          id: string
          interaction_type: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_type: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_type?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_interactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          source: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          source: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          source?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_achievements: {
        Row: {
          achievement_data: Json
          achievement_type: string
          id: string
          platform: string | null
          share_message: string | null
          shared_at: string | null
          user_id: string
        }
        Insert: {
          achievement_data: Json
          achievement_type: string
          id?: string
          platform?: string | null
          share_message?: string | null
          shared_at?: string | null
          user_id: string
        }
        Update: {
          achievement_data?: Json
          achievement_type?: string
          id?: string
          platform?: string | null
          share_message?: string | null
          shared_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      social_posts: {
        Row: {
          comments_count: number | null
          content: string
          created_at: string | null
          id: string
          likes_count: number | null
          metadata: Json | null
          post_type: string | null
          privacy_level: string | null
          shares_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comments_count?: number | null
          content: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          metadata?: Json | null
          post_type?: string | null
          privacy_level?: string | null
          shares_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comments_count?: number | null
          content?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          metadata?: Json | null
          post_type?: string | null
          privacy_level?: string | null
          shares_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_status: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_history: {
        Row: {
          changed_at: string | null
          id: string
          metadata: Json | null
          new_status: string | null
          new_tier: string | null
          previous_status: string | null
          previous_tier: string | null
          reason: string | null
          user_id: string | null
        }
        Insert: {
          changed_at?: string | null
          id?: string
          metadata?: Json | null
          new_status?: string | null
          new_tier?: string | null
          previous_status?: string | null
          previous_tier?: string | null
          reason?: string | null
          user_id?: string | null
        }
        Update: {
          changed_at?: string | null
          id?: string
          metadata?: Json | null
          new_status?: string | null
          new_tier?: string | null
          previous_status?: string | null
          previous_tier?: string | null
          reason?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_key: string
          id: string
          progress: number | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_key: string
          id?: string
          progress?: number | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_key?: string
          id?: string
          progress?: number | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_friendships: {
        Row: {
          addressee_id: string
          created_at: string | null
          id: string
          requester_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          addressee_id: string
          created_at?: string | null
          id?: string
          requester_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          addressee_id?: string
          created_at?: string | null
          id?: string
          requester_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_friendships_addressee_id_fkey"
            columns: ["addressee_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_friendships_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          message: string
          notification_type: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          notification_type: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          notification_type?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          bed_time: string | null
          connected_devices: Json | null
          created_at: string | null
          exercise_time: string | null
          has_completed_onboarding: boolean | null
          id: string
          lunch_break: boolean | null
          lunch_time: string | null
          meditation_experience: string | null
          meditation_goals: string[] | null
          morning_exercise: boolean | null
          notification_settings: Json | null
          preferred_session_duration: number | null
          stress_level: string | null
          theme: string | null
          updated_at: string | null
          user_id: string
          work_days: string[] | null
          work_end_time: string | null
          work_environment: string | null
          work_start_time: string | null
        }
        Insert: {
          bed_time?: string | null
          connected_devices?: Json | null
          created_at?: string | null
          exercise_time?: string | null
          has_completed_onboarding?: boolean | null
          id?: string
          lunch_break?: boolean | null
          lunch_time?: string | null
          meditation_experience?: string | null
          meditation_goals?: string[] | null
          morning_exercise?: boolean | null
          notification_settings?: Json | null
          preferred_session_duration?: number | null
          stress_level?: string | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
          work_days?: string[] | null
          work_end_time?: string | null
          work_environment?: string | null
          work_start_time?: string | null
        }
        Update: {
          bed_time?: string | null
          connected_devices?: Json | null
          created_at?: string | null
          exercise_time?: string | null
          has_completed_onboarding?: boolean | null
          id?: string
          lunch_break?: boolean | null
          lunch_time?: string | null
          meditation_experience?: string | null
          meditation_goals?: string[] | null
          morning_exercise?: boolean | null
          notification_settings?: Json | null
          preferred_session_duration?: number | null
          stress_level?: string | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
          work_days?: string[] | null
          work_end_time?: string | null
          work_environment?: string | null
          work_start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          biometric_sync_enabled: boolean | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          last_active: string | null
          meditation_minutes_limit: number | null
          meditation_minutes_used: number | null
          subscription_id: string | null
          subscription_period_end: string | null
          subscription_status: string | null
          subscription_tier: string | null
        }
        Insert: {
          avatar_url?: string | null
          biometric_sync_enabled?: boolean | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          last_active?: string | null
          meditation_minutes_limit?: number | null
          meditation_minutes_used?: number | null
          subscription_id?: string | null
          subscription_period_end?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
        }
        Update: {
          avatar_url?: string | null
          biometric_sync_enabled?: boolean | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          last_active?: string | null
          meditation_minutes_limit?: number | null
          meditation_minutes_used?: number | null
          subscription_id?: string | null
          subscription_period_end?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          active_badges: Json | null
          coin_balance: number | null
          created_at: string | null
          id: string
          reward_inventory: Json | null
          total_coins_earned: number | null
          total_coins_spent: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active_badges?: Json | null
          coin_balance?: number | null
          created_at?: string | null
          id?: string
          reward_inventory?: Json | null
          total_coins_earned?: number | null
          total_coins_spent?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active_badges?: Json | null
          coin_balance?: number | null
          created_at?: string | null
          id?: string
          reward_inventory?: Json | null
          total_coins_earned?: number | null
          total_coins_spent?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_social_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          current_streak: number | null
          display_name: string | null
          id: string
          level: number | null
          longest_streak: number | null
          privacy_settings: Json | null
          total_points: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          current_streak?: number | null
          display_name?: string | null
          id?: string
          level?: number | null
          longest_streak?: number | null
          privacy_settings?: Json | null
          total_points?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          current_streak?: number | null
          display_name?: string | null
          id?: string
          level?: number | null
          longest_streak?: number | null
          privacy_settings?: Json | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_social_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_exceeded_free_limits: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      has_premium_access: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      increment_meditation_usage: {
        Args: { user_id_param: string; minutes_used: number }
        Returns: undefined
      }
      reset_monthly_meditation_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
