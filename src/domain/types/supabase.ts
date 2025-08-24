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
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_id: string | null
          profile_id: string
          updated_at: string | null
          video_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          profile_id: string
          updated_at?: string | null
          video_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          profile_id?: string
          updated_at?: string | null
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "video_analytics"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "comments_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "video_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          profile_id: string
          video_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          profile_id: string
          video_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          profile_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "video_analytics"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "likes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "video_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      local_users: {
        Row: {
          created_at: string | null
          id: string
          name: string
          phone: string | null
          profile_id: string | null
          shop_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          phone?: string | null
          profile_id?: string | null
          shop_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          phone?: string | null
          profile_id?: string | null
          shop_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "local_users_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "local_users_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "video_analytics"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "local_users_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_points: {
        Row: {
          created_at: string | null
          id: string
          points: number
          profile_id: string
          shop_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          points?: number
          profile_id: string
          shop_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          points?: number
          profile_id?: string
          shop_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_points_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_points_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "video_analytics"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "loyalty_points_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_roles: {
        Row: {
          granted_at: string | null
          granted_by: string | null
          id: string
          profile_id: string
          role: Database["public"]["Enums"]["profile_role"]
        }
        Insert: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          profile_id: string
          role?: Database["public"]["Enums"]["profile_role"]
        }
        Update: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["profile_role"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_profile_roles_profile_id"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_profile_roles_profile_id"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "video_analytics"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profiles: {
        Row: {
          auth_id: string
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_active: boolean
          updated_at: string | null
          username: string | null
        }
        Insert: {
          auth_id: string
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          auth_id?: string
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          condition: string
          created_at: string | null
          description: string
          id: string
          shop_id: string
          updated_at: string | null
        }
        Insert: {
          condition: string
          created_at?: string | null
          description: string
          id?: string
          shop_id: string
          updated_at?: string | null
        }
        Update: {
          condition?: string
          created_at?: string | null
          description?: string
          id?: string
          shop_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promotions_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      queue_notes_suggestions: {
        Row: {
          created_at: string | null
          id: string
          shop_id: string
          suggestion_text: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          shop_id: string
          suggestion_text: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          shop_id?: string
          suggestion_text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "queue_notes_suggestions_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      queues: {
        Row: {
          amount_due: number
          amount_paid: number
          created_at: string | null
          id: string
          local_user_id: string
          note: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          queue_number: number
          shop_id: string
          status: Database["public"]["Enums"]["queue_status"]
          updated_at: string | null
        }
        Insert: {
          amount_due?: number
          amount_paid?: number
          created_at?: string | null
          id?: string
          local_user_id: string
          note?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          queue_number: number
          shop_id: string
          status?: Database["public"]["Enums"]["queue_status"]
          updated_at?: string | null
        }
        Update: {
          amount_due?: number
          amount_paid?: number
          created_at?: string | null
          id?: string
          local_user_id?: string
          note?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          queue_number?: number
          shop_id?: string
          status?: Database["public"]["Enums"]["queue_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "queues_local_user_id_fkey"
            columns: ["local_user_id"]
            isOneToOne: false
            referencedRelation: "local_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queues_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shops: {
        Row: {
          address: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          owner_id: string
          qr_code_url: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          owner_id: string
          qr_code_url?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          qr_code_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shops_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shops_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "video_analytics"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      videos: {
        Row: {
          category_id: string | null
          comments_count: number | null
          created_at: string | null
          description: string | null
          duration_seconds: number | null
          id: string
          likes_count: number | null
          profile_id: string
          title: string
          updated_at: string | null
          views_count: number | null
          youtube_id: string
        }
        Insert: {
          category_id?: string | null
          comments_count?: number | null
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          id?: string
          likes_count?: number | null
          profile_id: string
          title: string
          updated_at?: string | null
          views_count?: number | null
          youtube_id: string
        }
        Update: {
          category_id?: string | null
          comments_count?: number | null
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          id?: string
          likes_count?: number | null
          profile_id?: string
          title?: string
          updated_at?: string | null
          views_count?: number | null
          youtube_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "videos_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "videos_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "video_analytics"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      views: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string | null
          profile_id: string | null
          user_agent: string | null
          video_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          profile_id?: string | null
          user_agent?: string | null
          video_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          profile_id?: string | null
          user_agent?: string | null
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "video_analytics"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "views_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "video_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "views_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      video_analytics: {
        Row: {
          auth_id: string | null
          comments_count: number | null
          created_at: string | null
          creator_username: string | null
          id: string | null
          likes_count: number | null
          profile_id: string | null
          title: string | null
          updated_at: string | null
          views_count: number | null
          youtube_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_profile: {
        Args: { username: string; full_name?: string; avatar_url?: string }
        Returns: string
      }
      find_duplicate_videos: {
        Args: Record<PropertyKey, never>
        Returns: {
          url: string
          count: number
          video_ids: string[]
        }[]
      }
      get_active_profile: {
        Args: Record<PropertyKey, never>
        Returns: {
          auth_id: string
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_active: boolean
          updated_at: string | null
          username: string | null
        }[]
      }
      get_active_profile_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_active_profile_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["profile_role"]
      }
      get_daily_views: {
        Args: { days_count?: number }
        Returns: {
          date: string
          count: number
        }[]
      }
      get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_users: number
          user_growth: number
          total_videos: number
          video_growth: number
          total_categories: number
          today_views: number
          views_growth: number
        }[]
      }
      get_database_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          profiles_count: number
          videos_count: number
          categories_count: number
          likes_count: number
          comments_count: number
          views_count: number
        }[]
      }
      get_monthly_new_videos: {
        Args: { months_count?: number }
        Returns: {
          month: string
          count: number
        }[]
      }
      get_most_liked_videos: {
        Args: { limit_count?: number }
        Returns: {
          id: string
          title: string
          description: string
          youtube_id: string
          category_id: string
          category_name: string
          category_slug: string
          profile_id: string
          username: string
          avatar_url: string
          duration_seconds: number
          views_count: number
          likes_count: number
          comments_count: number
          created_at: string
          updated_at: string
        }[]
      }
      get_most_viewed_videos: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: Json
      }
      get_paginated_users: {
        Args: { p_page?: number; p_limit?: number }
        Returns: Json
      }
      get_popular_videos: {
        Args: { limit_count?: number }
        Returns: {
          id: string
          title: string
          profile_name: string
          views: number
        }[]
      }
      get_profile_role: {
        Args: { profile_id: string }
        Returns: Database["public"]["Enums"]["profile_role"]
      }
      get_recent_profiles: {
        Args: { limit_count?: number }
        Returns: {
          id: string
          name: string
          email: string
          created_at: string
          is_active: boolean
        }[]
      }
      get_recent_videos: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: Json
      }
      get_related_videos: {
        Args: { video_id: string; limit_count?: number }
        Returns: {
          id: string
          title: string
          youtube_id: string
          views_count: number
          likes_count: number
          comments_count: number
          created_at: string
        }[]
      }
      get_user_activity_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          profile_id: string
          username: string
          videos_count: number
          likes_count: number
        }[]
      }
      get_user_dashboard: {
        Args: Record<PropertyKey, never>
        Returns: {
          video_count: number
          total_views: number
          total_likes: number
          total_comments: number
          recent_videos: Json
        }[]
      }
      get_user_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          auth_id: string
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_active: boolean
          updated_at: string | null
          username: string | null
        }[]
      }
      get_video_details: {
        Args: { video_id: string }
        Returns: {
          id: string
          title: string
          description: string
          youtube_id: string
          category_id: string
          category_name: string
          category_slug: string
          user_id: string
          username: string
          avatar_url: string
          duration_seconds: number
          views_count: number
          likes_count: number
          comments_count: number
          created_at: string
          updated_at: string
          is_liked: boolean
        }[]
      }
      get_videos_by_category: {
        Args: { p_category_id: string; p_limit?: number; p_offset?: number }
        Returns: Json
      }
      get_videos_by_profile: {
        Args: { p_profile_id: string; p_limit?: number; p_offset?: number }
        Returns: Json
      }
      get_videos_liked_by_profile: {
        Args: {
          liked_by_profile_id: string
          p_limit?: number
          p_offset?: number
        }
        Returns: Json
      }
      increment_video_view: {
        Args: { param_video_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_moderator_or_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_shop_owner: {
        Args: { shop_id_param: string }
        Returns: boolean
      }
      is_shop_staff: {
        Args: { shop_id_param: string }
        Returns: boolean
      }
      migrate_profile_roles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      search_videos: {
        Args: { search_query: string; limit_count?: number }
        Returns: {
          id: string
          title: string
          description: string
          youtube_id: string
          category_id: string
          category_name: string
          category_slug: string
          views_count: number
          likes_count: number
          comments_count: number
          created_at: string
        }[]
      }
      search_videos_extended: {
        Args: {
          search_query: string
          limit_count?: number
          filter_category_slug?: string
        }
        Returns: {
          id: string
          title: string
          description: string
          youtube_id: string
          category_id: string
          category_name: string
          category_slug: string
          profile_id: string
          username: string
          avatar_url: string
          duration_seconds: number
          views_count: number
          likes_count: number
          comments_count: number
          created_at: string
          updated_at: string
        }[]
      }
      set_profile_active: {
        Args: { profile_id: string }
        Returns: boolean
      }
      set_profile_role: {
        Args: {
          target_profile_id: string
          new_role: Database["public"]["Enums"]["profile_role"]
        }
        Returns: boolean
      }
      toggle_video_like: {
        Args: { video_id: string }
        Returns: boolean
      }
    }
    Enums: {
      payment_status: "unpaid" | "partial" | "paid"
      profile_role: "user" | "moderator" | "admin"
      queue_status: "waiting" | "confirmed" | "served" | "canceled"
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
    Enums: {
      payment_status: ["unpaid", "partial", "paid"],
      profile_role: ["user", "moderator", "admin"],
      queue_status: ["waiting", "confirmed", "served", "canceled"],
    },
  },
} as const

