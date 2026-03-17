import { supabase } from './supabaseClient';
import { config } from './config';

export interface OrderNotificationSettings {
  id: string;
  notifications_enabled: boolean;
  admin_emails: string[];
  created_at: string;
  updated_at: string;
}

export interface SupplierNotificationRoute {
  id: string;
  email: string;
  category_id: string;
  subcategory_id: string | null;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

const SETTINGS_ROW_ID = '00000000-0000-0000-0000-000000000002';

export const orderNotificationSettingsService = {
  async getSettings(): Promise<OrderNotificationSettings | null> {
    if (!config.useSupabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('order_notification_settings')
        .select('*')
        .eq('id', SETTINGS_ROW_ID)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data as OrderNotificationSettings;
    } catch (error) {
      console.error('Error fetching order notification settings:', error);
      return null;
    }
  },

  async saveSettings(updates: {
    notifications_enabled: boolean;
    admin_emails: string[];
  }): Promise<OrderNotificationSettings> {
    if (!config.useSupabase) {
      throw new Error('Supabase is disabled');
    }

    const payload = {
      id: SETTINGS_ROW_ID,
      notifications_enabled: updates.notifications_enabled,
      admin_emails: updates.admin_emails,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('order_notification_settings')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error saving order notification settings:', error);
      throw error;
    }

    return data as OrderNotificationSettings;
  },

  async getSupplierRoutes(): Promise<SupplierNotificationRoute[]> {
    if (!config.useSupabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('supplier_notification_routes')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []) as SupplierNotificationRoute[];
    } catch (error) {
      console.error('Error fetching supplier notification routes:', error);
      return [];
    }
  },

  async replaceSupplierRoutes(
    routes: Array<{
      email: string;
      category_id: string;
      subcategory_id?: string | null;
      is_enabled: boolean;
    }>
  ): Promise<void> {
    if (!config.useSupabase) {
      throw new Error('Supabase is disabled');
    }

    const { error: deleteError } = await supabase
      .from('supplier_notification_routes')
      .delete()
      .not('id', 'is', null);

    if (deleteError) {
      console.error('Error clearing supplier notification routes:', deleteError);
      throw deleteError;
    }

    if (routes.length === 0) {
      return;
    }

    const { error: insertError } = await supabase
      .from('supplier_notification_routes')
      .insert(
        routes.map((route) => ({
          email: route.email,
          category_id: route.category_id,
          subcategory_id: route.subcategory_id || null,
          is_enabled: route.is_enabled,
        }))
      );

    if (insertError) {
      console.error('Error saving supplier notification routes:', insertError);
      throw insertError;
    }
  },
};
