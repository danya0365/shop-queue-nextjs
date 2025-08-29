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
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
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
            foreignKeyName: "customers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "video_analytics"
            referencedColumns: ["profile_id"]
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
          employee_count: number | null
          id: string
          name: string
          shop_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          employee_count?: number | null
          id?: string
          name: string
          shop_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          employee_count?: number | null
          id?: string
          name?: string
          shop_id?: string
          updated_at?: string | null
        }
        Relationships: [
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
          employee_code: string | null
          hire_date: string | null
          id: string
          is_on_duty: boolean | null
          last_login: string | null
          permissions: string[] | null
          position: string | null
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
          employee_code?: string | null
          hire_date?: string | null
          id?: string
          is_on_duty?: boolean | null
          last_login?: string | null
          permissions?: string[] | null
          position?: string | null
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
          employee_code?: string | null
          hire_date?: string | null
          id?: string
          is_on_duty?: boolean | null
          last_login?: string | null
          permissions?: string[] | null
          position?: string | null
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
            foreignKeyName: "employees_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "video_analytics"
            referencedColumns: ["profile_id"]
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
            referencedRelation: "services"
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
          applicable_services: string[] | null
          conditions: string[] | null
          created_at: string | null
          created_by: string
          description: string | null
          end_date: string
          id: string
          max_discount_amount: number | null
          min_purchase_amount: number | null
          name: string
          shop_id: string
          start_date: string
          status: Database["public"]["Enums"]["promotion_status"] | null
          type: Database["public"]["Enums"]["promotion_type"]
          updated_at: string | null
          usage_limit: number | null
          used_count: number | null
          value: number
        }
        Insert: {
          applicable_services?: string[] | null
          conditions?: string[] | null
          created_at?: string | null
          created_by: string
          description?: string | null
          end_date: string
          id?: string
          max_discount_amount?: number | null
          min_purchase_amount?: number | null
          name: string
          shop_id: string
          start_date: string
          status?: Database["public"]["Enums"]["promotion_status"] | null
          type: Database["public"]["Enums"]["promotion_type"]
          updated_at?: string | null
          usage_limit?: number | null
          used_count?: number | null
          value: number
        }
        Update: {
          applicable_services?: string[] | null
          conditions?: string[] | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_date?: string
          id?: string
          max_discount_amount?: number | null
          min_purchase_amount?: number | null
          name?: string
          shop_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["promotion_status"] | null
          type?: Database["public"]["Enums"]["promotion_type"]
          updated_at?: string | null
          usage_limit?: number | null
          used_count?: number | null
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
            foreignKeyName: "promotions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "video_analytics"
            referencedColumns: ["profile_id"]
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
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      queues: {
        Row: {
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
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_transactions: {
        Row: {
          created_at: string | null
          customer_point_transaction_id: string
          description: string | null
          id: string
          points: number
          related_queue_id: string | null
          reward_id: string | null
          transaction_date: string | null
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          created_at?: string | null
          customer_point_transaction_id: string
          description?: string | null
          id?: string
          points: number
          related_queue_id?: string | null
          reward_id?: string | null
          transaction_date?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          created_at?: string | null
          customer_point_transaction_id?: string
          description?: string | null
          id?: string
          points?: number
          related_queue_id?: string | null
          reward_id?: string | null
          transaction_date?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "reward_transactions_customer_point_transaction_id_fkey"
            columns: ["customer_point_transaction_id"]
            isOneToOne: false
            referencedRelation: "customer_point_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_transactions_related_queue_id_fkey"
            columns: ["related_queue_id"]
            isOneToOne: false
            referencedRelation: "queues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_transactions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
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
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_shop_id_fkey"
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
      employee_status: "active" | "inactive" | "on_leave"
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
      employee_status: ["active", "inactive", "on_leave"],
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
      reward_type: ["discount", "free_item", "cashback", "special_privilege"],
      shop_status: ["draft", "active", "inactive", "suspended"],
      transaction_type: ["earned", "redeemed", "expired"],
    },
  },
} as const

