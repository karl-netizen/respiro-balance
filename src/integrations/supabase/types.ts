export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ai_recommendation_feedback: {
        Row: {
          created_at: string
          feedback: Json
          id: string
          recommendation_id: string
          session_data: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback?: Json
          id?: string
          recommendation_id: string
          session_data?: Json
          user_id: string
        }
        Update: {
          created_at?: string
          feedback?: Json
          id?: string
          recommendation_id?: string
          session_data?: Json
          user_id?: string
        }
        Relationships: []
      }
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
      challenge_participants_new: {
        Row: {
          challenge_id: string
          completed_at: string | null
          id: string
          is_completed: boolean | null
          joined_at: string | null
          progress: number | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          id?: string
          is_completed?: boolean | null
          joined_at?: string | null
          progress?: number | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          id?: string
          is_completed?: boolean | null
          joined_at?: string | null
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_new_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
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
      challenges: {
        Row: {
          category: string | null
          challenge_type: string
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string
          id: string
          is_active: boolean | null
          name: string
          participants_count: number | null
          start_date: string
          target_metric: string | null
          target_value: number | null
        }
        Insert: {
          category?: string | null
          challenge_type: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          name: string
          participants_count?: number | null
          start_date: string
          target_metric?: string | null
          target_value?: number | null
        }
        Update: {
          category?: string | null
          challenge_type?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          participants_count?: number | null
          start_date?: string
          target_metric?: string | null
          target_value?: number | null
        }
        Relationships: []
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
      content_categories: {
        Row: {
          color_theme: string | null
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
        }
        Insert: {
          color_theme?: string | null
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
        }
        Update: {
          color_theme?: string | null
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
        }
        Relationships: []
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
      friendships: {
        Row: {
          created_at: string | null
          friend_id: string
          id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          friend_id: string
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          friend_id?: string
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
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
      meditation_audio: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          bitrate: number | null
          created_at: string | null
          duration_seconds: number | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          is_approved: boolean | null
          meditation_content_id: string | null
          sample_rate: number | null
          updated_at: string | null
          upload_status: string | null
          uploaded_by: string | null
          user_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          bitrate?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          is_approved?: boolean | null
          meditation_content_id?: string | null
          sample_rate?: number | null
          updated_at?: string | null
          upload_status?: string | null
          uploaded_by?: string | null
          user_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          bitrate?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          is_approved?: boolean | null
          meditation_content_id?: string | null
          sample_rate?: number | null
          updated_at?: string | null
          upload_status?: string | null
          uploaded_by?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meditation_audio_meditation_content_id_fkey"
            columns: ["meditation_content_id"]
            isOneToOne: false
            referencedRelation: "meditation_content"
            referencedColumns: ["id"]
          },
        ]
      }
      meditation_content: {
        Row: {
          audio_duration: number | null
          audio_file_path: string | null
          audio_file_size: number | null
          audio_file_url: string | null
          audio_quality: string | null
          average_rating: number | null
          background_music_type: string | null
          category: string
          content: string | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          duration: number
          has_audio: boolean | null
          id: string
          instructor: string | null
          is_active: boolean | null
          is_available: boolean | null
          is_featured: boolean | null
          play_count: number | null
          subscription_tier: string | null
          tags: string[] | null
          thumbnail_url: string | null
          tier: string | null
          title: string
          transcript: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          audio_duration?: number | null
          audio_file_path?: string | null
          audio_file_size?: number | null
          audio_file_url?: string | null
          audio_quality?: string | null
          average_rating?: number | null
          background_music_type?: string | null
          category: string
          content?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration: number
          has_audio?: boolean | null
          id?: string
          instructor?: string | null
          is_active?: boolean | null
          is_available?: boolean | null
          is_featured?: boolean | null
          play_count?: number | null
          subscription_tier?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          tier?: string | null
          title: string
          transcript?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          audio_duration?: number | null
          audio_file_path?: string | null
          audio_file_size?: number | null
          audio_file_url?: string | null
          audio_quality?: string | null
          average_rating?: number | null
          background_music_type?: string | null
          category?: string
          content?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration?: number
          has_audio?: boolean | null
          id?: string
          instructor?: string | null
          is_active?: boolean | null
          is_available?: boolean | null
          is_featured?: boolean | null
          play_count?: number | null
          subscription_tier?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          tier?: string | null
          title?: string
          transcript?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      role_change_audit: {
        Row: {
          action: string
          id: string
          ip_address: unknown
          performed_at: string
          performed_by: string | null
          reason: string | null
          role: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          id?: string
          ip_address?: unknown
          performed_at?: string
          performed_by?: string | null
          reason?: string | null
          role: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          id?: string
          ip_address?: unknown
          performed_at?: string
          performed_by?: string | null
          reason?: string | null
          role?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
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
      social_comments: {
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
            foreignKeyName: "social_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "social_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      social_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      social_notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          related_post_id: string | null
          related_user_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          related_post_id?: string | null
          related_user_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          related_post_id?: string | null
          related_user_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_notifications_related_post_id_fkey"
            columns: ["related_post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
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
      user_content_progress: {
        Row: {
          completed: boolean | null
          completion_count: number | null
          content_id: string
          created_at: string | null
          id: string
          is_favorite: boolean | null
          last_played_at: string | null
          progress_seconds: number | null
          rating: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completion_count?: number | null
          content_id: string
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          last_played_at?: string | null
          progress_seconds?: number | null
          rating?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completion_count?: number | null
          content_id?: string
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          last_played_at?: string | null
          progress_seconds?: number | null
          rating?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_content_progress_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "meditation_content"
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
      user_meditation_history: {
        Row: {
          content_id: string
          created_at: string | null
          id: string
          played_at: string
          user_id: string
        }
        Insert: {
          content_id: string
          created_at?: string | null
          id?: string
          played_at?: string
          user_id: string
        }
        Update: {
          content_id?: string
          created_at?: string | null
          id?: string
          played_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_meditation_history_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "meditation_content"
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
      user_roles: {
        Row: {
          created_at: string
          granted_at: string
          granted_by: string | null
          id: string
          notes: string | null
          revoked_at: string | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_at?: string
          granted_by?: string | null
          id?: string
          notes?: string | null
          revoked_at?: string | null
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          granted_at?: string
          granted_by?: string | null
          id?: string
          notes?: string | null
          revoked_at?: string | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      check_weekly_session_limit: {
        Args: { p_user_id: string }
        Returns: number
      }
      current_user_has_role: { Args: { role_name: string }; Returns: boolean }
      get_user_roles: {
        Args: { user_uuid: string }
        Returns: {
          granted_at: string
          granted_by: string
          role: string
        }[]
      }
      grant_role: {
        Args: {
          grant_notes?: string
          role_to_grant: string
          target_user_id: string
        }
        Returns: string
      }
      has_exceeded_free_limits: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      has_premium_access: { Args: { user_id_param: string }; Returns: boolean }
      has_role: {
        Args: { role_name: string; user_uuid: string }
        Returns: boolean
      }
      increment_meditation_usage: {
        Args: { minutes_used: number; user_id_param: string }
        Returns: undefined
      }
      increment_play_count: { Args: { content_id: string }; Returns: undefined }
      reset_monthly_meditation_limits: { Args: never; Returns: undefined }
      revoke_role: {
        Args: { role_to_revoke: string; target_user_id: string }
        Returns: boolean
      }
      update_content_progress: {
        Args: {
          p_completed?: boolean
          p_content_id: string
          p_progress_seconds: number
        }
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
