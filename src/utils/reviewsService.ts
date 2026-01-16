import { supabase } from './supabaseClient';
import { supabaseAdmin } from './supabaseAdmin';

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number; // 1-5
  comment?: string;
  user_name?: string;
  created_at: string;
}

export const reviewsService = {
  /**
   * Get all reviews for a product
   */
  async getByProductId(productId: string): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },

  /**
   * Add a new review
   */
  async addReview(review: Omit<Review, 'id' | 'created_at'>): Promise<Review | null> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert(review)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  /**
   * Check if user has already reviewed a product
   */
  async getUserReview(productId: string, userId: string): Promise<Review | null> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error checking user review:', error);
      return null;
    }
  },

  /**
   * Delete a review
   */
  async deleteReview(reviewId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }
};
