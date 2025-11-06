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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          order_id: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          order_id?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          order_id?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_transactions: {
        Row: {
          commission_amount: number
          commission_rate: number
          created_at: string | null
          id: string
          order_id: string
          paid_at: string | null
          seller_amount: number
          seller_id: string
          status: string | null
          total_amount: number
        }
        Insert: {
          commission_amount: number
          commission_rate: number
          created_at?: string | null
          id?: string
          order_id: string
          paid_at?: string | null
          seller_amount: number
          seller_id: string
          status?: string | null
          total_amount: number
        }
        Update: {
          commission_amount?: number
          commission_rate?: number
          created_at?: string | null
          id?: string
          order_id?: string
          paid_at?: string | null
          seller_amount?: number
          seller_id?: string
          status?: string | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "commission_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_transactions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "seller_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_codes: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          current_uses: number | null
          discount_type: string
          discount_value: number
          end_date: string
          id: string
          is_active: boolean | null
          max_uses: number | null
          min_purchase_amount: number | null
          start_date: string
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          discount_type: string
          discount_value: number
          end_date: string
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_purchase_amount?: number | null
          start_date: string
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          discount_type?: string
          discount_value?: number
          end_date?: string
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_purchase_amount?: number | null
          start_date?: string
        }
        Relationships: []
      }
      flash_sales: {
        Row: {
          created_at: string | null
          created_by: string | null
          discount_percentage: number
          end_time: string
          id: string
          is_active: boolean | null
          original_price: number
          product_id: string
          quantity_limit: number | null
          sale_price: number
          start_time: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          discount_percentage: number
          end_time: string
          id?: string
          is_active?: boolean | null
          original_price: number
          product_id: string
          quantity_limit?: number | null
          sale_price: number
          start_time: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          discount_percentage?: number
          end_time?: string
          id?: string
          is_active?: boolean | null
          original_price?: number
          product_id?: string
          quantity_limit?: number | null
          sale_price?: number
          start_time?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          email: string
          id: string
          subscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          subscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          subscribed_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          price: number
          product_id: string
          product_name: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          price: number
          product_id: string
          product_name: string
          quantity: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          product_name?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_tracking: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          order_id: string
          status: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_tracking_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          commission_amount: number | null
          created_at: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          discount_amount: number | null
          discount_code: string | null
          id: string
          notes: string | null
          order_number: string
          order_status: Database["public"]["Enums"]["order_status_type"] | null
          payment_method: Database["public"]["Enums"]["payment_method_type"]
          payment_status:
            | Database["public"]["Enums"]["payment_status_type"]
            | null
          seller_amount: number | null
          seller_id: string | null
          shipping_address: string
          shipping_address_id: string | null
          shipping_fee: number | null
          status: string
          tax_amount: number | null
          total_amount: number
          tracking_token: string | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          commission_amount?: number | null
          created_at?: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          discount_amount?: number | null
          discount_code?: string | null
          id?: string
          notes?: string | null
          order_number: string
          order_status?: Database["public"]["Enums"]["order_status_type"] | null
          payment_method: Database["public"]["Enums"]["payment_method_type"]
          payment_status?:
            | Database["public"]["Enums"]["payment_status_type"]
            | null
          seller_amount?: number | null
          seller_id?: string | null
          shipping_address: string
          shipping_address_id?: string | null
          shipping_fee?: number | null
          status?: string
          tax_amount?: number | null
          total_amount: number
          tracking_token?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          commission_amount?: number | null
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          discount_amount?: number | null
          discount_code?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          order_status?: Database["public"]["Enums"]["order_status_type"] | null
          payment_method?: Database["public"]["Enums"]["payment_method_type"]
          payment_status?:
            | Database["public"]["Enums"]["payment_status_type"]
            | null
          seller_amount?: number | null
          seller_id?: string | null
          shipping_address?: string
          shipping_address_id?: string | null
          shipping_fee?: number | null
          status?: string
          tax_amount?: number | null
          total_amount?: number
          tracking_token?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "seller_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_wallet: {
        Row: {
          balance: number
          id: string
          total_commission: number
          total_subscriptions: number
          updated_at: string | null
        }
        Insert: {
          balance?: number
          id?: string
          total_commission?: number
          total_subscriptions?: number
          updated_at?: string | null
        }
        Update: {
          balance?: number
          id?: string
          total_commission?: number
          total_subscriptions?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          product_id: string
          rating: number
          review_text: string | null
          seller_replied_at: string | null
          seller_reply: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id: string
          rating: number
          review_text?: string | null
          seller_replied_at?: string | null
          seller_reply?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string
          rating?: number
          review_text?: string | null
          seller_replied_at?: string | null
          seller_reply?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          additional_images: string[] | null
          brand_name: string | null
          category: string
          created_at: string | null
          created_by_admin: boolean | null
          description: string | null
          discount_percentage: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          price: number
          rating: number | null
          review_count: number | null
          seller_id: string | null
          stock_quantity: number | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          additional_images?: string[] | null
          brand_name?: string | null
          category: string
          created_at?: string | null
          created_by_admin?: boolean | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          price: number
          rating?: number | null
          review_count?: number | null
          seller_id?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          additional_images?: string[] | null
          brand_name?: string | null
          category?: string
          created_at?: string | null
          created_by_admin?: boolean | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          price?: number
          rating?: number | null
          review_count?: number | null
          seller_id?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "seller_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      seller_applications: {
        Row: {
          account_number: string
          agreed_to_commission: boolean
          bank_name: string
          brand_name: string
          business_address: string
          business_logo_url: string | null
          business_name: string
          business_website: string | null
          city: string
          country: string
          created_at: string | null
          email: string | null
          id: string
          id_card_url: string | null
          owner_full_name: string
          phone: string | null
          product_category: string
          rejection_reason: string | null
          state: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_number: string
          agreed_to_commission?: boolean
          bank_name: string
          brand_name: string
          business_address: string
          business_logo_url?: string | null
          business_name: string
          business_website?: string | null
          city: string
          country: string
          created_at?: string | null
          email?: string | null
          id?: string
          id_card_url?: string | null
          owner_full_name: string
          phone?: string | null
          product_category: string
          rejection_reason?: string | null
          state: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_number?: string
          agreed_to_commission?: boolean
          bank_name?: string
          brand_name?: string
          business_address?: string
          business_logo_url?: string | null
          business_name?: string
          business_website?: string | null
          city?: string
          country?: string
          created_at?: string | null
          email?: string | null
          id?: string
          id_card_url?: string | null
          owner_full_name?: string
          phone?: string | null
          product_category?: string
          rejection_reason?: string | null
          state?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      seller_followers: {
        Row: {
          created_at: string | null
          id: string
          seller_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          seller_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          seller_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seller_followers_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "seller_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_profiles: {
        Row: {
          account_number: string
          application_id: string | null
          bank_name: string
          brand_name: string
          business_name: string
          commission_rate: number
          created_at: string | null
          follower_count: number | null
          id: string
          is_active: boolean | null
          total_commission: number | null
          total_sales: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_number: string
          application_id?: string | null
          bank_name: string
          brand_name: string
          business_name: string
          commission_rate?: number
          created_at?: string | null
          follower_count?: number | null
          id?: string
          is_active?: boolean | null
          total_commission?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_number?: string
          application_id?: string | null
          bank_name?: string
          brand_name?: string
          business_name?: string
          commission_rate?: number
          created_at?: string | null
          follower_count?: number | null
          id?: string
          is_active?: boolean | null
          total_commission?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seller_profiles_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "seller_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_subscriptions: {
        Row: {
          created_at: string | null
          currency: string
          end_date: string
          id: string
          payment_reference: string | null
          seller_id: string
          start_date: string
          status: string
          subscription_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string
          end_date: string
          id?: string
          payment_reference?: string | null
          seller_id: string
          start_date?: string
          status?: string
          subscription_amount?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string
          end_date?: string
          id?: string
          payment_reference?: string | null
          seller_id?: string
          start_date?: string
          status?: string
          subscription_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seller_subscriptions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "seller_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string
          created_at: string | null
          full_name: string
          id: string
          is_default: boolean | null
          phone: string
          postal_code: string | null
          state: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country?: string
          created_at?: string | null
          full_name: string
          id?: string
          is_default?: boolean | null
          phone: string
          postal_code?: string | null
          state: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string
          created_at?: string | null
          full_name?: string
          id?: string
          is_default?: boolean | null
          phone?: string
          postal_code?: string | null
          state?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      shipping_rates: {
        Row: {
          country: string
          created_at: string | null
          id: string
          is_free_shipping: boolean | null
          rate: number
          state: string | null
          updated_at: string | null
          weight_from: number
          weight_to: number
        }
        Insert: {
          country: string
          created_at?: string | null
          id?: string
          is_free_shipping?: boolean | null
          rate: number
          state?: string | null
          updated_at?: string | null
          weight_from: number
          weight_to: number
        }
        Update: {
          country?: string
          created_at?: string | null
          id?: string
          is_free_shipping?: boolean | null
          rate?: number
          state?: string | null
          updated_at?: string | null
          weight_from?: number
          weight_to?: number
        }
        Relationships: []
      }
      site_visitors: {
        Row: {
          id: string
          ip_address: string | null
          page_url: string | null
          referrer: string | null
          user_agent: string | null
          user_id: string | null
          visited_at: string | null
        }
        Insert: {
          id?: string
          ip_address?: string | null
          page_url?: string | null
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
          visited_at?: string | null
        }
        Update: {
          id?: string
          ip_address?: string | null
          page_url?: string | null
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
          visited_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          order_id: string
          payment_data: Json | null
          payment_method: Database["public"]["Enums"]["payment_method_type"]
          payment_status: Database["public"]["Enums"]["payment_status_type"]
          transaction_reference: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          order_id: string
          payment_data?: Json | null
          payment_method: Database["public"]["Enums"]["payment_method_type"]
          payment_status?: Database["public"]["Enums"]["payment_status_type"]
          transaction_reference?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          order_id?: string
          payment_data?: Json | null
          payment_method?: Database["public"]["Enums"]["payment_method_type"]
          payment_status?: Database["public"]["Enums"]["payment_status_type"]
          transaction_reference?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          reference: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          reference?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          reference?: string | null
          transaction_type?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "seller" | "super_admin"
      order_status_type:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
      payment_method_type: "paystack" | "opay" | "moniepoint" | "bank_transfer"
      payment_status_type:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "refunded"
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
    Enums: {
      app_role: ["admin", "user", "seller", "super_admin"],
      order_status_type: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      payment_method_type: ["paystack", "opay", "moniepoint", "bank_transfer"],
      payment_status_type: [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
      ],
    },
  },
} as const
