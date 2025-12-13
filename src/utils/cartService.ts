import { supabase } from './supabaseClient';
import { config } from './config';

/**
 * Cart item interface matching the database schema
 */
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  // Joined product data
  product?: {
    name: string;
    price: number;
    image_url: string;
    category: string;
  };
}

/**
 * Cart Service - Handles all cart operations with Supabase
 */
export const cartService = {
  /**
   * Get all cart items for a user
   */
  async getAll(userId: string): Promise<CartItem[]> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(name, price, image_url, category)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log(`✅ Loaded ${data?.length || 0} cart items from database`);
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching cart items:', error);
      throw error;
    }
  },

  /**
   * Add item to cart or update quantity if exists
   */
  async addItem(userId: string, productId: string, quantity: number = 1): Promise<CartItem> {
    if (!config.useSupabase) {
      throw new Error('Supabase is not enabled');
    }

    try {
      // Check if item already exists
      const { data: existing, error: checkError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existing) {
        // Update quantity
        return await this.updateQuantity(existing.id, existing.quantity + quantity);
      } else {
        // Insert new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            product_id: productId,
            quantity
          })
          .select()
          .single();

        if (error) throw error;
        if (!data) throw new Error('Failed to add item to cart');

        console.log('✅ Item added to cart:', productId);
        return data;
      }
    } catch (error) {
      console.error('❌ Error adding item to cart:', error);
      throw error;
    }
  },

  /**
   * Update cart item quantity
   */
  async updateQuantity(cartItemId: string, quantity: number): Promise<CartItem> {
    if (!config.useSupabase) {
      throw new Error('Supabase is not enabled');
    }

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ 
          quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', cartItemId)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Cart item not found');

      console.log('✅ Cart quantity updated:', cartItemId, quantity);
      return data;
    } catch (error) {
      console.error('❌ Error updating cart quantity:', error);
      throw error;
    }
  },

  /**
   * Remove item from cart
   */
  async removeItem(cartItemId: string): Promise<void> {
    if (!config.useSupabase) {
      throw new Error('Supabase is not enabled');
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;

      console.log('✅ Item removed from cart:', cartItemId);
    } catch (error) {
      console.error('❌ Error removing item from cart:', error);
      throw error;
    }
  },

  /**
   * Clear all cart items for a user
   */
  async clearCart(userId: string): Promise<void> {
    if (!config.useSupabase) {
      throw new Error('Supabase is not enabled');
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      console.log('✅ Cart cleared for user:', userId);
    } catch (error) {
      console.error('❌ Error clearing cart:', error);
      throw error;
    }
  },

  /**
   * Get cart count for a user
   */
  async getCount(userId: string): Promise<number> {

    try {
      const { count, error } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      console.error('❌ Error getting cart count:', error);
      return 0;
    }
  }
};
