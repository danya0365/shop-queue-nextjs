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
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      category_shops: {
        Row: {
          category_id: string
          created_at: string | null
          id: string
          shop_id: string
          updated_at: string | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          id?: string
          shop_id: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          id?: string
          shop_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_shops_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_shops_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category_info_stats_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_shops_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
          },
          {
            foreignKeyName: "category_shops_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_point_expiry: {
        Row: {
          created_at: string | null
          customer_point_transaction_id: string
          expiry_date: string
          id: string
          points: number
        }
        Insert: {
          created_at?: string | null
          customer_point_transaction_id: string
          expiry_date: string
          id?: string
          points: number
        }
        Update: {
          created_at?: string | null
          customer_point_transaction_id?: string
          expiry_date?: string
          id?: string
          points?: number
        }
        Relationships: [
          {
            foreignKeyName: "customer_point_expiry_customer_point_transaction_id_fkey"
            columns: ["customer_point_transaction_id"]
            isOneToOne: false
            referencedRelation: "customer_point_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_point_transactions: {
        Row: {
          created_at: string | null
          customer_point_id: string
          description: string | null
          id: string
          metadata: Json | null
          points: number
          related_queue_id: string | null
          transaction_date: string | null
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          created_at?: string | null
          customer_point_id: string
          description?: string | null
          id?: string
          metadata?: Json | null
          points: number
          related_queue_id?: string | null
          transaction_date?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          created_at?: string | null
          customer_point_id?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          points?: number
          related_queue_id?: string | null
          transaction_date?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "customer_point_transactions_customer_point_id_fkey"
            columns: ["customer_point_id"]
            isOneToOne: false
            referencedRelation: "customer_points"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_point_transactions_related_queue_id_fkey"
            columns: ["related_queue_id"]
            isOneToOne: false
            referencedRelation: "queues"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_points: {
        Row: {
          created_at: string | null
          current_points: number | null
          customer_id: string
          id: string
          membership_tier: Database["public"]["Enums"]["membership_tier"] | null
          shop_id: string
          tier_benefits: string[] | null
          total_earned: number | null
          total_redeemed: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_points?: number | null
          customer_id: string
          id?: string
          membership_tier?:
            | Database["public"]["Enums"]["membership_tier"]
            | null
          shop_id: string
          tier_benefits?: string[] | null
          total_earned?: number | null
          total_redeemed?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_points?: number | null
          customer_id?: string
          id?: string
          membership_tier?:
            | Database["public"]["Enums"]["membership_tier"]
            | null
          shop_id?: string
          tier_benefits?: string[] | null
          total_earned?: number | null
          total_redeemed?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_points_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_points_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
          },
          {
            foreignKeyName: "customer_points_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_reward_redemptions: {
        Row: {
          cancelled_at: string | null
          cancelled_by_employee_id: string | null
          cancelled_reason: string | null
          created_at: string | null
          customer_id: string
          customer_point_transaction_id: string | null
          expires_at: string
          id: string
          issued_at: string | null
          metadata: Json | null
          notes: string | null
          points_used: number
          redemption_code: string
          redemption_type: Database["public"]["Enums"]["redemption_type"] | null
          reward_id: string
          reward_value: number
          shop_id: string
          source_description: string | null
          status: string | null
          updated_at: string | null
          used_at: string | null
          used_by_employee_id: string | null
          used_queue_id: string | null
        }
        Insert: {
          cancelled_at?: string | null
          cancelled_by_employee_id?: string | null
          cancelled_reason?: string | null
          created_at?: string | null
          customer_id: string
          customer_point_transaction_id?: string | null
          expires_at: string
          id?: string
          issued_at?: string | null
          metadata?: Json | null
          notes?: string | null
          points_used?: number
          redemption_code: string
          redemption_type?:
            | Database["public"]["Enums"]["redemption_type"]
            | null
          reward_id: string
          reward_value: number
          shop_id: string
          source_description?: string | null
          status?: string | null
          updated_at?: string | null
          used_at?: string | null
          used_by_employee_id?: string | null
          used_queue_id?: string | null
        }
        Update: {
          cancelled_at?: string | null
          cancelled_by_employee_id?: string | null
          cancelled_reason?: string | null
          created_at?: string | null
          customer_id?: string
          customer_point_transaction_id?: string | null
          expires_at?: string
          id?: string
          issued_at?: string | null
          metadata?: Json | null
          notes?: string | null
          points_used?: number
          redemption_code?: string
          redemption_type?:
            | Database["public"]["Enums"]["redemption_type"]
            | null
          reward_id?: string
          reward_value?: number
          shop_id?: string
          source_description?: string | null
          status?: string | null
          updated_at?: string | null
          used_at?: string | null
          used_by_employee_id?: string | null
          used_queue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_reward_redemptions_cancelled_by_employee_id_fkey"
            columns: ["cancelled_by_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_reward_redemptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_reward_redemptions_customer_point_transaction_id_fkey"
            columns: ["customer_point_transaction_id"]
            isOneToOne: false
            referencedRelation: "customer_point_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_reward_redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_reward_redemptions_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
          },
          {
            foreignKeyName: "customer_reward_redemptions_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_reward_redemptions_used_by_employee_id_fkey"
            columns: ["used_by_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_reward_redemptions_used_queue_id_fkey"
            columns: ["used_queue_id"]
            isOneToOne: false
            referencedRelation: "queues"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          gender: string | null
          id: string
          is_active: boolean | null
          last_visit: string | null
          name: string
          notes: string | null
          phone: string | null
          profile_id: string | null
          shop_id: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean | null
          last_visit?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          profile_id?: string | null
          shop_id: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean | null
          last_visit?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          profile_id?: string | null
          shop_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
          },
          {
            foreignKeyName: "customers_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          shop_id: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          shop_id: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          shop_id?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
          },
          {
            foreignKeyName: "departments_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string | null
          department_id: string | null
          email: string | null
          employee_code: string
          hire_date: string | null
          id: string
          is_on_duty: boolean | null
          last_login: string | null
          name: string
          notes: string | null
          permissions: string[] | null
          phone: string | null
          position_text: string | null
          profile_id: string
          salary: number | null
          shop_id: string
          station_number: number | null
          status: Database["public"]["Enums"]["employee_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          email?: string | null
          employee_code: string
          hire_date?: string | null
          id?: string
          is_on_duty?: boolean | null
          last_login?: string | null
          name: string
          notes?: string | null
          permissions?: string[] | null
          phone?: string | null
          position_text?: string | null
          profile_id: string
          salary?: number | null
          shop_id: string
          station_number?: number | null
          status?: Database["public"]["Enums"]["employee_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          email?: string | null
          employee_code?: string
          hire_date?: string | null
          id?: string
          is_on_duty?: boolean | null
          last_login?: string | null
          name?: string
          notes?: string | null
          permissions?: string[] | null
          phone?: string | null
          position_text?: string | null
          profile_id?: string
          salary?: number | null
          shop_id?: string
          station_number?: number | null
          status?: Database["public"]["Enums"]["employee_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "department_employee_counts_view"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
          },
          {
            foreignKeyName: "employees_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          new_queue: boolean | null
          push_notifications: boolean | null
          queue_update: boolean | null
          shift_reminder: boolean | null
          shop_id: string
          sms_notifications: boolean | null
          system_alerts: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          new_queue?: boolean | null
          push_notifications?: boolean | null
          queue_update?: boolean | null
          shift_reminder?: boolean | null
          shop_id: string
          sms_notifications?: boolean | null
          system_alerts?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          new_queue?: boolean | null
          push_notifications?: boolean | null
          queue_update?: boolean | null
          shift_reminder?: boolean | null
          shop_id?: string
          sms_notifications?: boolean | null
          system_alerts?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_settings_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: true
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
          },
          {
            foreignKeyName: "notification_settings_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: true
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_items: {
        Row: {
          created_at: string | null
          id: string
          name: string
          payment_id: string
          price: number
          quantity: number | null
          service_id: string
          total: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          payment_id: string
          price: number
          quantity?: number | null
          service_id: string
          total: number
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          payment_id?: string
          price?: number
          quantity?: number | null
          service_id?: string
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "payment_items_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "popular_services_by_category_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "popular_services_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "top_popular_services_view"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          created_at: string | null
          id: string
          paid_amount: number | null
          payment_date: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          processed_by_employee_id: string | null
          queue_id: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          paid_amount?: number | null
          payment_date?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          processed_by_employee_id?: string | null
          queue_id: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          paid_amount?: number | null
          payment_date?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          processed_by_employee_id?: string | null
          queue_id?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_processed_by_employee_id_fkey"
            columns: ["processed_by_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_queue_id_fkey"
            columns: ["queue_id"]
            isOneToOne: false
            referencedRelation: "queues"
            referencedColumns: ["id"]
          },
        ]
      }
      poster_templates: {
        Row: {
          accent_color: string | null
          background_color: string | null
          category: Database["public"]["Enums"]["poster_category"]
          created_at: string | null
          description: string | null
          features: string[] | null
          id: string
          is_premium: boolean | null
          layout: Database["public"]["Enums"]["poster_layout"] | null
          name: string
          preview_image: string | null
          price: number | null
          text_color: string | null
          updated_at: string | null
        }
        Insert: {
          accent_color?: string | null
          background_color?: string | null
          category: Database["public"]["Enums"]["poster_category"]
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          is_premium?: boolean | null
          layout?: Database["public"]["Enums"]["poster_layout"] | null
          name: string
          preview_image?: string | null
          price?: number | null
          text_color?: string | null
          updated_at?: string | null
        }
        Update: {
          accent_color?: string | null
          background_color?: string | null
          category?: Database["public"]["Enums"]["poster_category"]
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          is_premium?: boolean | null
          layout?: Database["public"]["Enums"]["poster_layout"] | null
          name?: string
          preview_image?: string | null
          price?: number | null
          text_color?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
            foreignKeyName: "profile_roles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          auth_id: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string | null
          gender: string | null
          id: string
          is_active: boolean
          last_login: string | null
          login_count: number
          phone: string | null
          preferences: Json
          privacy_settings: Json
          social_links: Json | null
          updated_at: string | null
          username: string | null
          verification_status: string
        }
        Insert: {
          address?: string | null
          auth_id: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean
          last_login?: string | null
          login_count?: number
          phone?: string | null
          preferences?: Json
          privacy_settings?: Json
          social_links?: Json | null
          updated_at?: string | null
          username?: string | null
          verification_status?: string
        }
        Update: {
          address?: string | null
          auth_id?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean
          last_login?: string | null
          login_count?: number
          phone?: string | null
          preferences?: Json
          privacy_settings?: Json
          social_links?: Json | null
          updated_at?: string | null
          username?: string | null
          verification_status?: string
        }
        Relationships: []
      }
      promotion_services: {
        Row: {
          id: string
          promotion_id: string
          service_id: string
        }
        Insert: {
          id?: string
          promotion_id: string
          service_id: string
        }
        Update: {
          id?: string
          promotion_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotion_services_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "popular_services_by_category_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "popular_services_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "top_popular_services_view"
            referencedColumns: ["id"]
          },
        ]
      }
      promotion_usage_logs: {
        Row: {
          customer_id: string | null
          id: string
          promotion_id: string
          queue_id: string | null
          used_at: string | null
        }
        Insert: {
          customer_id?: string | null
          id?: string
          promotion_id: string
          queue_id?: string | null
          used_at?: string | null
        }
        Update: {
          customer_id?: string | null
          id?: string
          promotion_id?: string
          queue_id?: string | null
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promotion_usage_logs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_usage_logs_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_usage_logs_queue_id_fkey"
            columns: ["queue_id"]
            isOneToOne: false
            referencedRelation: "queues"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          conditions: Json | null
          created_at: string | null
          created_by: string
          description: string | null
          end_at: string
          id: string
          max_discount_amount: number | null
          min_purchase_amount: number | null
          name: string
          shop_id: string
          start_at: string
          status: Database["public"]["Enums"]["promotion_status"] | null
          type: Database["public"]["Enums"]["promotion_type"]
          updated_at: string | null
          usage_limit: number | null
          value: number
        }
        Insert: {
          conditions?: Json | null
          created_at?: string | null
          created_by: string
          description?: string | null
          end_at: string
          id?: string
          max_discount_amount?: number | null
          min_purchase_amount?: number | null
          name: string
          shop_id: string
          start_at: string
          status?: Database["public"]["Enums"]["promotion_status"] | null
          type: Database["public"]["Enums"]["promotion_type"]
          updated_at?: string | null
          usage_limit?: number | null
          value: number
        }
        Update: {
          conditions?: Json | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_at?: string
          id?: string
          max_discount_amount?: number | null
          min_purchase_amount?: number | null
          name?: string
          shop_id?: string
          start_at?: string
          status?: Database["public"]["Enums"]["promotion_status"] | null
          type?: Database["public"]["Enums"]["promotion_type"]
          updated_at?: string | null
          usage_limit?: number | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "promotions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotions_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
          },
          {
            foreignKeyName: "promotions_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      queue_services: {
        Row: {
          created_at: string | null
          id: string
          price: number
          quantity: number | null
          queue_id: string
          service_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          price: number
          quantity?: number | null
          queue_id: string
          service_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          price?: number
          quantity?: number | null
          queue_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "queue_services_queue_id_fkey"
            columns: ["queue_id"]
            isOneToOne: false
            referencedRelation: "queues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queue_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "popular_services_by_category_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queue_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "popular_services_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queue_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queue_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "top_popular_services_view"
            referencedColumns: ["id"]
          },
        ]
      }
      queues: {
        Row: {
          cancelled_at: string | null
          cancelled_note: string | null
          cancelled_reason: string | null
          completed_at: string | null
          created_at: string | null
          customer_id: string
          estimated_call_time: string | null
          estimated_duration: number | null
          feedback: string | null
          id: string
          note: string | null
          priority: Database["public"]["Enums"]["queue_priority"] | null
          queue_number: string
          rating: number | null
          served_at: string | null
          served_by_employee_id: string | null
          shop_id: string
          status: Database["public"]["Enums"]["queue_status"] | null
          updated_at: string | null
        }
        Insert: {
          cancelled_at?: string | null
          cancelled_note?: string | null
          cancelled_reason?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_id: string
          estimated_call_time?: string | null
          estimated_duration?: number | null
          feedback?: string | null
          id?: string
          note?: string | null
          priority?: Database["public"]["Enums"]["queue_priority"] | null
          queue_number: string
          rating?: number | null
          served_at?: string | null
          served_by_employee_id?: string | null
          shop_id: string
          status?: Database["public"]["Enums"]["queue_status"] | null
          updated_at?: string | null
        }
        Update: {
          cancelled_at?: string | null
          cancelled_note?: string | null
          cancelled_reason?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_id?: string
          estimated_call_time?: string | null
          estimated_duration?: number | null
          feedback?: string | null
          id?: string
          note?: string | null
          priority?: Database["public"]["Enums"]["queue_priority"] | null
          queue_number?: string
          rating?: number | null
          served_at?: string | null
          served_by_employee_id?: string | null
          shop_id?: string
          status?: Database["public"]["Enums"]["queue_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "queues_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queues_served_by_employee_id_fkey"
            columns: ["served_by_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queues_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
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
      rewards: {
        Row: {
          created_at: string | null
          description: string | null
          expiry_days: number | null
          icon: string | null
          id: string
          is_available: boolean | null
          name: string
          points_required: number
          shop_id: string
          type: Database["public"]["Enums"]["reward_type"]
          updated_at: string | null
          usage_limit: number | null
          value: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          expiry_days?: number | null
          icon?: string | null
          id?: string
          is_available?: boolean | null
          name: string
          points_required: number
          shop_id: string
          type: Database["public"]["Enums"]["reward_type"]
          updated_at?: string | null
          usage_limit?: number | null
          value: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          expiry_days?: number | null
          icon?: string | null
          id?: string
          is_available?: boolean | null
          name?: string
          points_required?: number
          shop_id?: string
          type?: Database["public"]["Enums"]["reward_type"]
          updated_at?: string | null
          usage_limit?: number | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "rewards_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
          },
          {
            foreignKeyName: "rewards_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          estimated_duration: number | null
          icon: string | null
          id: string
          is_available: boolean | null
          name: string
          popularity_rank: number | null
          price: number
          shop_id: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          estimated_duration?: number | null
          icon?: string | null
          id?: string
          is_available?: boolean | null
          name: string
          popularity_rank?: number | null
          price: number
          shop_id: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          estimated_duration?: number | null
          icon?: string | null
          id?: string
          is_available?: boolean | null
          name?: string
          popularity_rank?: number | null
          price?: number
          shop_id?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
          },
          {
            foreignKeyName: "services_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_activity_log: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          shop_id: string
          title: string
          type: Database["public"]["Enums"]["activity_type"]
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          shop_id: string
          title: string
          type: Database["public"]["Enums"]["activity_type"]
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          shop_id?: string
          title?: string
          type?: Database["public"]["Enums"]["activity_type"]
        }
        Relationships: [
          {
            foreignKeyName: "shop_activity_log_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
          },
          {
            foreignKeyName: "shop_activity_log_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_opening_hours: {
        Row: {
          break_end: string | null
          break_start: string | null
          close_time: string | null
          created_at: string | null
          day_of_week: string
          id: string
          is_open: boolean | null
          open_time: string | null
          shop_id: string
          updated_at: string | null
        }
        Insert: {
          break_end?: string | null
          break_start?: string | null
          close_time?: string | null
          created_at?: string | null
          day_of_week: string
          id?: string
          is_open?: boolean | null
          open_time?: string | null
          shop_id: string
          updated_at?: string | null
        }
        Update: {
          break_end?: string | null
          break_start?: string | null
          close_time?: string | null
          created_at?: string | null
          day_of_week?: string
          id?: string
          is_open?: boolean | null
          open_time?: string | null
          shop_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shop_opening_hours_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
          },
          {
            foreignKeyName: "shop_opening_hours_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_settings: {
        Row: {
          allow_advance_booking: boolean | null
          allow_registration: boolean | null
          auto_confirm_queues: boolean | null
          backup_frequency: string | null
          booking_window_hours: number | null
          cancellation_deadline: number | null
          created_at: string | null
          data_retention_days: number | null
          estimated_service_time: number | null
          id: string
          log_level: string | null
          maintenance_mode: boolean | null
          max_queue_size: number | null
          require_email_verification: boolean | null
          session_timeout: number | null
          shop_id: string
          updated_at: string | null
        }
        Insert: {
          allow_advance_booking?: boolean | null
          allow_registration?: boolean | null
          auto_confirm_queues?: boolean | null
          backup_frequency?: string | null
          booking_window_hours?: number | null
          cancellation_deadline?: number | null
          created_at?: string | null
          data_retention_days?: number | null
          estimated_service_time?: number | null
          id?: string
          log_level?: string | null
          maintenance_mode?: boolean | null
          max_queue_size?: number | null
          require_email_verification?: boolean | null
          session_timeout?: number | null
          shop_id: string
          updated_at?: string | null
        }
        Update: {
          allow_advance_booking?: boolean | null
          allow_registration?: boolean | null
          auto_confirm_queues?: boolean | null
          backup_frequency?: string | null
          booking_window_hours?: number | null
          cancellation_deadline?: number | null
          created_at?: string | null
          data_retention_days?: number | null
          estimated_service_time?: number | null
          id?: string
          log_level?: string | null
          maintenance_mode?: boolean | null
          max_queue_size?: number | null
          require_email_verification?: boolean | null
          session_timeout?: number | null
          shop_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shop_settings_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: true
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
          },
          {
            foreignKeyName: "shop_settings_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: true
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shops: {
        Row: {
          address: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          email: string | null
          id: string
          language: string | null
          logo: string | null
          name: string
          owner_id: string
          phone: string | null
          qr_code_url: string | null
          slug: string
          status: Database["public"]["Enums"]["shop_status"] | null
          timezone: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          email?: string | null
          id?: string
          language?: string | null
          logo?: string | null
          name: string
          owner_id: string
          phone?: string | null
          qr_code_url?: string | null
          slug: string
          status?: Database["public"]["Enums"]["shop_status"] | null
          timezone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          email?: string | null
          id?: string
          language?: string | null
          logo?: string | null
          name?: string
          owner_id?: string
          phone?: string | null
          qr_code_url?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["shop_status"] | null
          timezone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shops_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      category_info_stats_view: {
        Row: {
          active_shops_count: number | null
          available_services_count: number | null
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string | null
          name: string | null
          services_count: number | null
          shops_count: number | null
          slug: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      category_stats_view: {
        Row: {
          active_categories: number | null
          least_popular_category: string | null
          most_popular_category: string | null
          total_categories: number | null
          total_services: number | null
          total_shops: number | null
        }
        Relationships: []
      }
      customer_stats_view: {
        Row: {
          active_customers_today: number | null
          bronze_members: number | null
          gold_members: number | null
          new_customers_this_month: number | null
          regular_members: number | null
          shop_id: string | null
          silver_members: number | null
          total_customers: number | null
        }
        Relationships: []
      }
      dashboard_stats_view: {
        Row: {
          active_queues: number | null
          average_wait_time: number | null
          completed_queues_today: number | null
          total_customers: number | null
          total_employees: number | null
          total_queues: number | null
          total_revenue: number | null
          total_shops: number | null
        }
        Relationships: []
      }
      department_employee_counts_view: {
        Row: {
          department_id: string | null
          department_name: string | null
          employee_count: number | null
          shop_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
          },
          {
            foreignKeyName: "departments_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      department_stats_by_shop_view: {
        Row: {
          active_departments: number | null
          average_employees_per_department: number | null
          shop_id: string | null
          shop_name: string | null
          total_departments: number | null
          total_employees: number | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
          },
          {
            foreignKeyName: "departments_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      department_stats_summary_view: {
        Row: {
          active_departments: number | null
          average_employees_per_department: number | null
          total_departments: number | null
          total_employees: number | null
        }
        Relationships: []
      }
      employee_stats_view: {
        Row: {
          active_employees: number | null
          customer_service_count: number | null
          logged_in_today: number | null
          management_count: number | null
          new_employees_this_month: number | null
          other_count: number | null
          sales_count: number | null
          technical_count: number | null
          total_employees: number | null
        }
        Relationships: []
      }
      monthly_reward_usage_view: {
        Row: {
          month_display: string | null
          month_year: string | null
          points_used: number | null
          redemptions_issued: number | null
          redemptions_used: number | null
          shop_id: string | null
          total_reward_value: number | null
          unique_customers: number | null
          usage_rate_percent: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_reward_redemptions_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
          },
          {
            foreignKeyName: "customer_reward_redemptions_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_method_stats_by_shop_view: {
        Row: {
          count: number | null
          payment_method: string | null
          percentage: number | null
          shop_id: string | null
          total_amount: number | null
        }
        Relationships: [
          {
            foreignKeyName: "queues_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
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
      payment_method_stats_summary_view: {
        Row: {
          count: number | null
          payment_method: string | null
          percentage: number | null
          total_amount: number | null
        }
        Relationships: []
      }
      payment_stats_by_shop_view: {
        Row: {
          average_payment_amount: number | null
          most_used_payment_method:
            | Database["public"]["Enums"]["payment_method"]
            | null
          paid_payments: number | null
          partial_payments: number | null
          shop_id: string | null
          today_revenue: number | null
          total_payments: number | null
          total_revenue: number | null
          unpaid_payments: number | null
        }
        Relationships: [
          {
            foreignKeyName: "queues_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
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
      payment_stats_summary_view: {
        Row: {
          average_payment_amount: number | null
          most_used_payment_method:
            | Database["public"]["Enums"]["payment_method"]
            | null
          paid_payments: number | null
          partial_payments: number | null
          today_revenue: number | null
          total_payments: number | null
          total_revenue: number | null
          unpaid_payments: number | null
        }
        Relationships: []
      }
      popular_rewards_view: {
        Row: {
          avg_points_per_redemption: number | null
          last_redemption_date: string | null
          points_required: number | null
          popularity_rank: number | null
          redemption_count: number | null
          reward_id: string | null
          reward_name: string | null
          reward_type: Database["public"]["Enums"]["reward_type"] | null
          shop_id: string | null
          total_points_used: number | null
          unique_customers: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_reward_redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_reward_redemptions_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
          },
          {
            foreignKeyName: "customer_reward_redemptions_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      popular_services_by_category_view: {
        Row: {
          category: string | null
          id: string | null
          name: string | null
          queue_count: number | null
          rank_in_category: number | null
          revenue: number | null
        }
        Relationships: []
      }
      popular_services_view: {
        Row: {
          category: string | null
          id: string | null
          name: string | null
          queue_count: number | null
          revenue: number | null
        }
        Relationships: []
      }
      profile_stats_view: {
        Row: {
          active_profiles_today: number | null
          new_profiles_this_month: number | null
          pending_verification: number | null
          profiles_by_gender: Json | null
          total_profiles: number | null
          verified_profiles: number | null
        }
        Relationships: []
      }
      promotion_stats_by_shop_view: {
        Row: {
          active_promotions: number | null
          average_discount_amount: number | null
          expired_promotions: number | null
          inactive_promotions: number | null
          most_used_promotion_type:
            | Database["public"]["Enums"]["promotion_type"]
            | null
          scheduled_promotions: number | null
          shop_id: string | null
          total_discount_given: number | null
          total_promotions: number | null
          total_usage: number | null
        }
        Relationships: [
          {
            foreignKeyName: "promotions_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
          },
          {
            foreignKeyName: "promotions_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      promotion_stats_summary_view: {
        Row: {
          active_promotions: number | null
          average_discount_amount: number | null
          expired_promotions: number | null
          inactive_promotions: number | null
          most_used_promotion_type:
            | Database["public"]["Enums"]["promotion_type"]
            | null
          scheduled_promotions: number | null
          total_discount_given: number | null
          total_promotions: number | null
          total_usage: number | null
        }
        Relationships: []
      }
      queue_stats_view: {
        Row: {
          average_wait_time: number | null
          cancelled_today: number | null
          completed_today: number | null
          in_progress_queues: number | null
          total_queues: number | null
          waiting_queues: number | null
        }
        Relationships: []
      }
      queue_status_distribution_flexible_view: {
        Row: {
          avg_queue_time_minutes: number | null
          cancelled: number | null
          completed: number | null
          no_show: number | null
          queue_date: string | null
          serving: number | null
          shop_id: string | null
          shop_name: string | null
          total_queues: number | null
          waiting: number | null
        }
        Relationships: [
          {
            foreignKeyName: "queues_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
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
      queue_status_distribution_today_by_shop_view: {
        Row: {
          cancelled: number | null
          completed: number | null
          last_queue_update: string | null
          no_show: number | null
          serving: number | null
          shop_id: string | null
          shop_name: string | null
          total_queues_today: number | null
          waiting: number | null
        }
        Relationships: [
          {
            foreignKeyName: "queues_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
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
      queue_status_distribution_today_view: {
        Row: {
          cancelled: number | null
          completed: number | null
          last_queue_update: string | null
          no_show: number | null
          serving: number | null
          total_queues_today: number | null
          waiting: number | null
        }
        Relationships: []
      }
      queue_status_distribution_view: {
        Row: {
          cancelled: number | null
          completed: number | null
          last_queue_update: string | null
          no_show: number | null
          serving: number | null
          total_queues: number | null
          waiting: number | null
        }
        Relationships: []
      }
      reward_stats_by_redemption_type_view: {
        Row: {
          active_redemptions: number | null
          expired_redemptions: number | null
          redemption_type: Database["public"]["Enums"]["redemption_type"] | null
          shop_id: string | null
          total_points_used: number | null
          total_redemptions: number | null
          total_reward_value: number | null
          usage_rate_percent: number | null
          used_redemptions: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_reward_redemptions_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
          },
          {
            foreignKeyName: "customer_reward_redemptions_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_stats_by_shop_view: {
        Row: {
          active_rewards: number | null
          average_redemption_value: number | null
          popular_reward_type: Database["public"]["Enums"]["reward_type"] | null
          shop_id: string | null
          total_points_redeemed: number | null
          total_redemptions: number | null
          total_rewards: number | null
        }
        Relationships: []
      }
      reward_stats_summary_view: {
        Row: {
          active_rewards: number | null
          average_redemption_value: number | null
          popular_reward_type: Database["public"]["Enums"]["reward_type"] | null
          total_points_redeemed: number | null
          total_redemptions: number | null
          total_rewards: number | null
        }
        Relationships: []
      }
      service_by_shop_stats_view: {
        Row: {
          available_services: number | null
          average_price: number | null
          popular_services: Json | null
          services_by_category: Json | null
          shop_id: string | null
          total_revenue: number | null
          total_services: number | null
          unavailable_services: number | null
        }
        Relationships: [
          {
            foreignKeyName: "services_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
          },
          {
            foreignKeyName: "services_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      service_stats_summary_view: {
        Row: {
          available_services: number | null
          average_price: number | null
          popular_services: Json | null
          services_by_category: Json | null
          total_revenue: number | null
          total_services: number | null
          unavailable_services: number | null
        }
        Relationships: []
      }
      shop_stats_view: {
        Row: {
          active_shops: number | null
          new_this_month: number | null
          pending_approval: number | null
          total_shops: number | null
        }
        Relationships: []
      }
      top_popular_services_view: {
        Row: {
          category: string | null
          id: string | null
          name: string | null
          queue_count: number | null
          revenue: number | null
        }
        Relationships: []
      }
      top_reward_customers_view: {
        Row: {
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          last_redemption_date: string | null
          rank: number | null
          redemption_type_variety: number | null
          shop_id: string | null
          total_points_used: number | null
          total_redemptions: number | null
          total_reward_value: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_reward_redemptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_reward_redemptions_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "customer_stats_view"
            referencedColumns: ["shop_id"]
          },
          {
            foreignKeyName: "customer_reward_redemptions_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      cleanup_old_activities: {
        Args: { p_days_to_keep?: number }
        Returns: number
      }
      create_customer: {
        Args: {
          shop_id_param: string
          name_param: string
          phone_param?: string
          email_param?: string
          date_of_birth_param?: string
          gender_param?: string
          address_param?: string
          notes_param?: string
        }
        Returns: Json
      }
      create_employee: {
        Args: {
          p_employee_code: string
          p_name: string
          p_email: string
          p_phone: string
          p_department_id: string
          p_position: string
          p_shop_id: string
          p_status: Database["public"]["Enums"]["employee_status"]
          p_hire_date: string
          p_permissions: string[]
          p_salary: number
          p_notes: string
        }
        Returns: string
      }
      create_profile: {
        Args: { username: string; full_name?: string; avatar_url?: string }
        Returns: string
      }
      create_shop_activity: {
        Args: {
          p_shop_id: string
          p_type: Database["public"]["Enums"]["activity_type"]
          p_title: string
          p_description: string
          p_metadata?: Json
        }
        Returns: string
      }
      delete_customer: {
        Args: { shop_id_param: string; customer_id_param: string }
        Returns: boolean
      }
      delete_employee: {
        Args: { p_employee_id: string }
        Returns: boolean
      }
      get_active_profile: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string | null
          auth_id: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string | null
          gender: string | null
          id: string
          is_active: boolean
          last_login: string | null
          login_count: number
          phone: string | null
          preferences: Json
          privacy_settings: Json
          social_links: Json | null
          updated_at: string | null
          username: string | null
          verification_status: string
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
      get_auth_user_by_id: {
        Args: { p_id: string }
        Returns: Json
      }
      get_auth_user_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_customer_by_id: {
        Args: { shop_id_param: string; customer_id_param: string }
        Returns: Json
      }
      get_customer_stats: {
        Args: { shop_id_param: string }
        Returns: Json
      }
      get_employee_by_id: {
        Args: { p_employee_id: string }
        Returns: {
          id: string
          employee_code: string
          name: string
          email: string
          phone: string
          department_id: string
          department_name: string
          position_text: string
          shop_id: string
          shop_name: string
          status: Database["public"]["Enums"]["employee_status"]
          hire_date: string
          last_login: string
          permissions: string[]
          salary: number
          notes: string
          created_at: string
          updated_at: string
        }[]
      }
      get_employee_stats: {
        Args: { p_shop_id?: string }
        Returns: {
          total_employees: number
          active_employees: number
          logged_in_today: number
          new_employees_this_month: number
          management_count: number
          customer_service_count: number
          technical_count: number
          sales_count: number
          other_count: number
        }[]
      }
      get_paginated_customers: {
        Args: {
          shop_id_param: string
          page_param?: number
          page_size_param?: number
          search_term?: string
          sort_by?: string
          sort_order?: string
        }
        Returns: Json
      }
      get_paginated_employees: {
        Args: { p_page?: number; p_limit?: number; p_shop_id?: string }
        Returns: {
          id: string
          employee_code: string
          name: string
          email: string
          phone: string
          department_id: string
          department_name: string
          position_text: string
          shop_id: string
          shop_name: string
          status: Database["public"]["Enums"]["employee_status"]
          hire_date: string
          last_login: string
          permissions: string[]
          salary: number
          notes: string
          created_at: string
          updated_at: string
          total_count: number
        }[]
      }
      get_paginated_users: {
        Args: { p_page?: number; p_limit?: number }
        Returns: Json
      }
      get_profile_role: {
        Args: { profile_id: string }
        Returns: Database["public"]["Enums"]["profile_role"]
      }
      get_queue_status_distribution: {
        Args: { p_shop_id: string; p_start_date?: string; p_end_date?: string }
        Returns: {
          waiting: number
          serving: number
          completed: number
          cancelled: number
          no_show: number
        }[]
      }
      get_user_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string | null
          auth_id: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string | null
          gender: string | null
          id: string
          is_active: boolean
          last_login: string | null
          login_count: number
          phone: string | null
          preferences: Json
          privacy_settings: Json
          social_links: Json | null
          updated_at: string | null
          username: string | null
          verification_status: string
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_moderator_or_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_service_role: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_shop_employee: {
        Args: { shop_id_param: string }
        Returns: boolean
      }
      is_shop_manager: {
        Args: { shop_id_param: string }
        Returns: boolean
      }
      is_shop_owner: {
        Args: { shop_id_param: string }
        Returns: boolean
      }
      migrate_profile_roles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      owner_update_shop_status: {
        Args: {
          p_shop_id: string
          p_new_status: Database["public"]["Enums"]["shop_status"]
        }
        Returns: undefined
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
      update_customer: {
        Args: {
          shop_id_param: string
          customer_id_param: string
          name_param?: string
          phone_param?: string
          email_param?: string
          date_of_birth_param?: string
          gender_param?: string
          address_param?: string
          notes_param?: string
          is_active_param?: boolean
        }
        Returns: Json
      }
      update_employee: {
        Args: {
          p_employee_id: string
          p_employee_code?: string
          p_name?: string
          p_email?: string
          p_phone?: string
          p_department_id?: string
          p_position_text?: string
          p_shop_id?: string
          p_status?: Database["public"]["Enums"]["employee_status"]
          p_hire_date?: string
          p_permissions?: string[]
          p_salary?: number
          p_notes?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      activity_type:
        | "queue_created"
        | "queue_updated"
        | "queue_completed"
        | "queue_cancelled"
        | "queue_served"
        | "queue_confirmed"
        | "customer_registered"
        | "customer_updated"
        | "customer_deleted"
        | "customer_visit"
        | "shop_created"
        | "shop_updated"
        | "shop_status_changed"
        | "shop_settings_updated"
        | "employee_added"
        | "employee_updated"
        | "employee_removed"
        | "employee_login"
        | "employee_logout"
        | "employee_duty_start"
        | "employee_duty_end"
        | "service_added"
        | "service_updated"
        | "service_removed"
        | "service_availability_changed"
        | "payment_created"
        | "payment_completed"
        | "payment_failed"
        | "payment_refunded"
        | "promotion_created"
        | "promotion_updated"
        | "promotion_activated"
        | "promotion_deactivated"
        | "promotion_used"
        | "points_earned"
        | "points_redeemed"
        | "points_expired"
        | "reward_claimed"
        | "membership_upgraded"
        | "system_backup"
        | "system_maintenance"
        | "system_error"
        | "system_alert"
        | "department_created"
        | "department_updated"
        | "department_removed"
        | "opening_hours_updated"
        | "shop_opened"
        | "shop_closed"
      employee_status: "active" | "inactive" | "suspended"
      membership_tier: "bronze" | "silver" | "gold" | "platinum"
      payment_method: "cash" | "card" | "qr" | "transfer"
      payment_status: "unpaid" | "partial" | "paid"
      poster_category: "modern" | "classic" | "minimal" | "professional"
      poster_layout: "portrait" | "landscape" | "square"
      profile_role: "user" | "moderator" | "admin"
      promotion_status: "active" | "inactive" | "expired" | "scheduled"
      promotion_type:
        | "percentage"
        | "fixed_amount"
        | "buy_x_get_y"
        | "free_item"
      queue_priority: "normal" | "high" | "vip"
      queue_status:
        | "waiting"
        | "confirmed"
        | "serving"
        | "completed"
        | "cancelled"
      redemption_type:
        | "points_redemption"
        | "free_reward"
        | "special_event"
        | "promotional_gift"
        | "loyalty_bonus"
      reward_type: "discount" | "free_item" | "cashback" | "special_privilege"
      shop_status: "draft" | "active" | "inactive" | "suspended"
      transaction_type: "earned" | "redeemed" | "expired"
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
      activity_type: [
        "queue_created",
        "queue_updated",
        "queue_completed",
        "queue_cancelled",
        "queue_served",
        "queue_confirmed",
        "customer_registered",
        "customer_updated",
        "customer_deleted",
        "customer_visit",
        "shop_created",
        "shop_updated",
        "shop_status_changed",
        "shop_settings_updated",
        "employee_added",
        "employee_updated",
        "employee_removed",
        "employee_login",
        "employee_logout",
        "employee_duty_start",
        "employee_duty_end",
        "service_added",
        "service_updated",
        "service_removed",
        "service_availability_changed",
        "payment_created",
        "payment_completed",
        "payment_failed",
        "payment_refunded",
        "promotion_created",
        "promotion_updated",
        "promotion_activated",
        "promotion_deactivated",
        "promotion_used",
        "points_earned",
        "points_redeemed",
        "points_expired",
        "reward_claimed",
        "membership_upgraded",
        "system_backup",
        "system_maintenance",
        "system_error",
        "system_alert",
        "department_created",
        "department_updated",
        "department_removed",
        "opening_hours_updated",
        "shop_opened",
        "shop_closed",
      ],
      employee_status: ["active", "inactive", "suspended"],
      membership_tier: ["bronze", "silver", "gold", "platinum"],
      payment_method: ["cash", "card", "qr", "transfer"],
      payment_status: ["unpaid", "partial", "paid"],
      poster_category: ["modern", "classic", "minimal", "professional"],
      poster_layout: ["portrait", "landscape", "square"],
      profile_role: ["user", "moderator", "admin"],
      promotion_status: ["active", "inactive", "expired", "scheduled"],
      promotion_type: [
        "percentage",
        "fixed_amount",
        "buy_x_get_y",
        "free_item",
      ],
      queue_priority: ["normal", "high", "vip"],
      queue_status: [
        "waiting",
        "confirmed",
        "serving",
        "completed",
        "cancelled",
      ],
      redemption_type: [
        "points_redemption",
        "free_reward",
        "special_event",
        "promotional_gift",
        "loyalty_bonus",
      ],
      reward_type: ["discount", "free_item", "cashback", "special_privilege"],
      shop_status: ["draft", "active", "inactive", "suspended"],
      transaction_type: ["earned", "redeemed", "expired"],
    },
  },
} as const

