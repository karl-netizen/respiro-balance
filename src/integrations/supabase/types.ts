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
