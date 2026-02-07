import { supabase } from './supabaseClient';

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export const userService = {
  /**
   * Upload user avatar to Supabase storage and update user profile
   */
  async uploadAvatar(userId: string, file: File): Promise<string | null> {
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `${userId}-${timestamp}`;
      const filePath = `avatars/${userId}/${fileName}`;

      // Upload file to storage
      const { data, error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath);

      // Update user profile with avatar URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },

  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  /**
   * Delete user avatar
   */
  async deleteAvatar(userId: string): Promise<void> {
    try {
      // Get current avatar URL to find the file path
      const profile = await this.getProfile(userId);
      if (!profile?.avatar_url) return;

      // Extract file path from public URL
      // URL format: https://..../storage/v1/object/public/user-avatars/avatars/userId/filename
      const urlParts = profile.avatar_url.split('/user-avatars/');
      if (urlParts.length === 2) {
        const filePath = urlParts[1];
        
        // Delete from storage
        const { error: deleteError } = await supabase.storage
          .from('user-avatars')
          .remove([filePath]);

        if (deleteError) throw deleteError;
      }

      // Remove avatar URL from profile
      await this.updateProfile(userId, { avatar_url: null });
    } catch (error) {
      console.error('Error deleting avatar:', error);
      throw error;
    }
  }
};
