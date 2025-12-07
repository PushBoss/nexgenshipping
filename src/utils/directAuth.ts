import { supabase } from './supabaseClient';
import { config } from './config';

/**
 * CORS-free authentication using direct database operations
 * This bypasses Supabase Auth CORS issues by creating sessions manually
 */

export interface DirectAuthUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_admin?: boolean;
  created_at?: string;
}

export interface DirectAuthResponse {
  success: boolean;
  user?: DirectAuthUser;
  error?: string;
  token?: string;
}

/**
 * Hash password using Web Crypto API (client-side)
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a simple session token
 */
function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const directAuth = {
  /**
   * Sign up - Create user directly in database
   */
  async signUp(
    email: string, 
    password: string, 
    metadata?: { firstName?: string; lastName?: string }
  ): Promise<DirectAuthResponse> {
    if (!config.useSupabase) {
      return { success: false, error: 'Supabase is disabled' };
    }

    try {
      console.log('🔵 Direct signup for:', email);

      // Hash password
      const passwordHash = await hashPassword(password);

      // Check if user exists
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        return { success: false, error: 'User already exists' };
      }

      // Generate UUID for the user
      const userId = crypto.randomUUID();

      // Create user profile - trigger will handle auth.users entry
      console.log('🔵 Inserting user into user_profiles...', { userId, email });
      const { data: newUser, error } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          email,
          password_hash: passwordHash,
          first_name: metadata?.firstName || '',
          last_name: metadata?.lastName || '',
          is_admin: false,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating user:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        return { success: false, error: error.message };
      }

      console.log('✅ User created successfully in Supabase:', newUser);
      
      // Verify the user was actually stored
      const { data: verifyUser, error: verifyError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (verifyError) {
        console.warn('⚠️ Could not verify user creation:', verifyError);
      } else {
        console.log('✅ Verified user in database:', verifyUser);
      }

      // Generate session token
      const token = generateToken();
      
      // Store session in localStorage
      localStorage.setItem('direct_auth_token', token);
      localStorage.setItem('direct_auth_user', JSON.stringify(newUser));

      return {
        success: true,
        user: newUser,
        token,
      };
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Sign in - Verify credentials against database
   */
  async signIn(email: string, password: string): Promise<DirectAuthResponse> {
    if (!config.useSupabase) {
      return { success: false, error: 'Supabase is disabled' };
    }

    try {
      console.log('🔵 Direct signin for:', email);

      // Hash password
      const passwordHash = await hashPassword(password);

      // Find user with matching email and password
      const { data: user, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .eq('password_hash', passwordHash)
        .single();

      if (error || !user) {
        console.error('❌ Invalid credentials');
        return { success: false, error: 'Invalid email or password' };
      }

      console.log('✅ User authenticated successfully');

      // Generate session token
      const token = generateToken();
      
      // Store session in localStorage
      localStorage.setItem('direct_auth_token', token);
      localStorage.setItem('direct_auth_user', JSON.stringify(user));

      return {
        success: true,
        user,
        token,
      };
    } catch (error: any) {
      console.error('❌ Signin error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get current session
   */
  getCurrentSession(): DirectAuthUser | null {
    const token = localStorage.getItem('direct_auth_token');
    const userJson = localStorage.getItem('direct_auth_user');

    if (!token || !userJson) {
      return null;
    }

    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getCurrentSession();
  },

  /**
   * Sign out
   */
  signOut(): void {
    localStorage.removeItem('direct_auth_token');
    localStorage.removeItem('direct_auth_user');
    console.log('✅ Signed out successfully');
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<DirectAuthUser>): Promise<DirectAuthResponse> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Update localStorage
      localStorage.setItem('direct_auth_user', JSON.stringify(data));

      return {
        success: true,
        user: data,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Promote user to admin
   */
  async promoteToAdmin(userId: string): Promise<DirectAuthResponse> {
    console.log('🔵 Promoting user to admin:', userId);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ is_admin: true })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error promoting user:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ User promoted to admin:', data);

      // Update localStorage if it's the current user
      const currentUser = this.getCurrentSession();
      if (currentUser?.id === userId) {
        localStorage.setItem('direct_auth_user', JSON.stringify(data));
      }

      return {
        success: true,
        user: data,
      };
    } catch (error: any) {
      console.error('❌ Promote error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<{ success: boolean; users?: DirectAuthUser[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        users: data,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};
