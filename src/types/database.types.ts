// Database types for NEX-GEN Shipping Agency
// Auto-generated types matching Supabase schema

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_addresses: {
        Row: {
          id: string;
          user_id: string;
          address_type: 'shipping' | 'billing';
          is_default: boolean;
          street: string;
          city: string;
          state: string;
          zip_code: string;
          country: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          address_type?: 'shipping' | 'billing';
          is_default?: boolean;
          street: string;
          city: string;
          state: string;
          zip_code: string;
          country?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          address_type?: 'shipping' | 'billing';
          is_default?: boolean;
          street?: string;
          city?: string;
          state?: string;
          zip_code?: string;
          country?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_notification_preferences: {
        Row: {
          id: string;
          user_id: string;
          order_updates: boolean;
          promotions: boolean;
          newsletter: boolean;
          sms_alerts: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_updates?: boolean;
          promotions?: boolean;
          newsletter?: boolean;
          sms_alerts?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          order_updates?: boolean;
          promotions?: boolean;
          newsletter?: boolean;
          sms_alerts?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          parent_id: string | null;
          image_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          slug: string;
          description?: string | null;
          parent_id?: string | null;
          image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          parent_id?: string | null;
          image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: 'baby' | 'pharmaceutical';
          category_id: string | null;
          subcategory_id: string | null;
          price: number;
          original_price: number | null;
          cost_price: number | null;
          image_url: string;
          rating: number;
          review_count: number;
          stock_count: number;
          sold_count: number;
          in_stock: boolean;
          badge: string | null;
          sku: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category: 'baby' | 'pharmaceutical';
          category_id?: string | null;
          subcategory_id?: string | null;
          price: number;
          original_price?: number | null;
          cost_price?: number | null;
          image_url: string;
          rating?: number;
          review_count?: number;
          stock_count?: number;
          sold_count?: number;
          in_stock?: boolean;
          badge?: string | null;
          sku?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          category?: 'baby' | 'pharmaceutical';
          category_id?: string | null;
          subcategory_id?: string | null;
          price?: number;
          original_price?: number | null;
          cost_price?: number | null;
          image_url?: string;
          rating?: number;
          review_count?: number;
          stock_count?: number;
          sold_count?: number;
          in_stock?: boolean;
          badge?: string | null;
          sku?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          rating: number;
          title: string | null;
          comment: string | null;
          verified_purchase: boolean;
          helpful_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          rating: number;
          title?: string | null;
          comment?: string | null;
          verified_purchase?: boolean;
          helpful_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
          rating?: number;
          title?: string | null;
          comment?: string | null;
          verified_purchase?: boolean;
          helpful_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      wishlist_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          status: 'processing' | 'confirmed' | 'in-transit' | 'delivered' | 'cancelled' | 'refunded';
          subtotal: number;
          tax: number;
          shipping_cost: number;
          total: number;
          shipping_method: 'standard' | 'express' | 'overnight' | null;
          tracking_number: string | null;
          estimated_delivery: string | null;
          delivered_at: string | null;
          shipping_full_name: string;
          shipping_email: string;
          shipping_phone: string | null;
          shipping_address: string;
          shipping_city: string;
          shipping_state: string;
          shipping_zip_code: string;
          shipping_country: string;
          payment_method: 'credit-card' | 'debit-card' | 'paypal' | 'bank-transfer' | null;
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_transaction_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          user_id: string;
          status?: 'processing' | 'confirmed' | 'in-transit' | 'delivered' | 'cancelled' | 'refunded';
          subtotal: number;
          tax: number;
          shipping_cost: number;
          total: number;
          shipping_method?: 'standard' | 'express' | 'overnight' | null;
          tracking_number?: string | null;
          estimated_delivery?: string | null;
          delivered_at?: string | null;
          shipping_full_name: string;
          shipping_email: string;
          shipping_phone?: string | null;
          shipping_address: string;
          shipping_city: string;
          shipping_state: string;
          shipping_zip_code: string;
          shipping_country?: string;
          payment_method?: 'credit-card' | 'debit-card' | 'paypal' | 'bank-transfer' | null;
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_transaction_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string;
          status?: 'processing' | 'confirmed' | 'in-transit' | 'delivered' | 'cancelled' | 'refunded';
          subtotal?: number;
          tax?: number;
          shipping_cost?: number;
          total?: number;
          shipping_method?: 'standard' | 'express' | 'overnight' | null;
          tracking_number?: string | null;
          estimated_delivery?: string | null;
          delivered_at?: string | null;
          shipping_full_name?: string;
          shipping_email?: string;
          shipping_phone?: string | null;
          shipping_address?: string;
          shipping_city?: string;
          shipping_state?: string;
          shipping_zip_code?: string;
          shipping_country?: string;
          payment_method?: 'credit-card' | 'debit-card' | 'paypal' | 'bank-transfer' | null;
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_transaction_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_image_url: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_image_url?: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          product_name?: string;
          product_image_url?: string | null;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          created_at?: string;
        };
      };
      inventory_transactions: {
        Row: {
          id: string;
          product_id: string;
          transaction_type: 'purchase' | 'sale' | 'return' | 'adjustment' | 'restock';
          quantity_change: number;
          previous_stock: number;
          new_stock: number;
          order_id: string | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          transaction_type: 'purchase' | 'sale' | 'return' | 'adjustment' | 'restock';
          quantity_change: number;
          previous_stock: number;
          new_stock: number;
          order_id?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          transaction_type?: 'purchase' | 'sale' | 'return' | 'adjustment' | 'restock';
          quantity_change?: number;
          previous_stock?: number;
          new_stock?: number;
          order_id?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      product_sales_analytics: {
        Row: {
          product_id: string;
          product_name: string;
          category: string;
          total_orders: number;
          total_units_sold: number;
          total_revenue: number;
          average_price: number;
          last_sale_date: string | null;
        };
      };
    };
    Functions: {
      get_cart_total: {
        Args: { p_user_id: string };
        Returns: number;
      };
      search_products: {
        Args: { 
          search_query: string;
          p_category?: string | null;
        };
        Returns: {
          id: string;
          name: string;
          description: string | null;
          category: string;
          price: number;
          image_url: string;
          rating: number;
          review_count: number;
          in_stock: boolean;
          rank: number;
        }[];
      };
    };
  };
}
