import { supabase } from './supabaseClient';
import { config } from './config';

/**
 * Wishlist item interface matching the database schema
 */
export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  // Joined product data
  product?: {
    name: string;
    price: number;
    image_url: string;
    category: string;
    rating?: number;
    review_count?: number;
    in_stock?: boolean;
  };
}

/**
 * Wishlist Service - Handles all wishlist operations with Supabase
 */
export const wishlistService = {
  /**
   * Get all wishlist items for a user
   */
  async getAll(userId: string): Promise<WishlistItem[]> {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select(`
          *,
          product:products(name, price, image_url, category, rating, review_count, in_stock)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log(`✅ Loaded ${data?.length || 0} wishlist items from database`);
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching wishlist items:', error);
      throw error;
    }
  },

  /**
   * Add item to wishlist
   */
  async addItem(userId: string, productId: string): Promise<WishlistItem> {
    if (!config.useSupabase) {
      throw new Error('Supabase is not enabled');
    }

    try {
      // Check if item already exists
      const { data: existing } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

      if (existing) {
        console.log('ℹ️ Item already in wishlist:', productId);
        return existing;
      }

      // Insert new item
      const { data, error } = await supabase
        .from('wishlist_items')
        .insert({
          user_id: userId,
          product_id: productId
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to add item to wishlist');

      console.log('✅ Item added to wishlist:', productId);
      return data;
    } catch (error) {
      console.error('❌ Error adding item to wishlist:', error);
      throw error;
    }
  },

  /**
   * Remove item from wishlist
   */
  async removeItem(wishlistItemId: string): Promise<void> {
    if (!config.useSupabase) {
      throw new Error('Supabase is not enabled');
    }

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', wishlistItemId);

      if (error) throw error;

      console.log('✅ Item removed from wishlist:', wishlistItemId);
    } catch (error) {
      console.error('❌ Error removing item from wishlist:', error);
      throw error;
    }
  },

  /**
   * Remove item from wishlist by product ID
   */
  async removeByProductId(userId: string, productId: string): Promise<void> {
    if (!config.useSupabase) {
      throw new Error('Supabase is not enabled');
    }

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) throw error;

      console.log('✅ Product removed from wishlist:', productId);
    } catch (error) {
      console.error('❌ Error removing product from wishlist:', error);
      throw error;
    }
  },

  /**
   * Check if item is in wishlist
   */
  async isInWishlist(userId: string, productId: string): Promise<boolean> {

    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('❌ Error checking wishlist:', error);
      return false;
    }
  },

  /**
   * Clear all wishlist items for a user
   */
  async clearWishlist(userId: string): Promise<void> {
    if (!config.useSupabase) {
      throw new Error('Supabase is not enabled');
    }

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      console.log('✅ Wishlist cleared for user:', userId);
    } catch (error) {
      console.error('❌ Error clearing wishlist:', error);
      throw error;
    }
  },

  /**
   * Get wishlist count for a user
   */
  async getCount(userId: string): Promise<number> {

    try {
      const { count, error } = await supabase
        .from('wishlist_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      console.error('❌ Error getting wishlist count:', error);
      return 0;
    }
  }
};
