/**
 * Payment Gateway Settings Service
 * Manages payment gateway configuration (DimePay) stored in Supabase
 */

import { supabase } from './supabaseClient';
import { supabaseAdmin } from './supabaseAdmin';
import { config } from './config';

export interface PaymentGatewaySettings {
  id: string;
  merchant_id: string | null;
  secret_key: string | null;
  client_key: string | null;
  environment: 'sandbox' | 'production';
  fee_handling: 'merchant' | 'customer';
  platform_fee_percentage: number;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

const SETTINGS_ROW_ID = '00000000-0000-0000-0000-000000000001';

export const paymentGatewayService = {
  /**
   * Get current payment gateway settings
   */
  async getSettings(): Promise<PaymentGatewaySettings | null> {
    if (!config.useSupabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('payment_gateway_settings')
        .select('*')
        .eq('id', SETTINGS_ROW_ID)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Row doesn't exist, return null
          return null;
        }
        throw error;
      }

      return data as PaymentGatewaySettings;
    } catch (error) {
      console.error('Error fetching payment gateway settings:', error);
      return null;
    }
  },

  /**
   * Update payment gateway settings (admin only)
   */
  async updateSettings(updates: Partial<Omit<PaymentGatewaySettings, 'id' | 'created_at' | 'updated_at'>>): Promise<PaymentGatewaySettings> {
    if (!config.useSupabase) {
      throw new Error('Supabase is disabled');
    }

    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      // Use admin client to bypass RLS
      const { data, error } = await supabaseAdmin
        .from('payment_gateway_settings')
        .update(updateData)
        .eq('id', SETTINGS_ROW_ID)
        .select()
        .single();

      if (error) throw error;

      if (config.debugMode) {
        console.log('✅ Payment gateway settings updated:', data);
      }

      return data as PaymentGatewaySettings;
    } catch (error) {
      console.error('Error updating payment gateway settings:', error);
      throw error;
    }
  },

  /**
   * Get DimePay API base URL based on environment
   */
  getDimePayBaseUrl(environment: 'sandbox' | 'production'): string {
    return environment === 'production'
      ? 'https://api.dimepay.app/dapi/v1'
      : 'https://sandbox.api.dimepay.app/dapi/v1';
  },

  /**
   * Check if payment gateway is configured and enabled
   */
  async isConfigured(): Promise<boolean> {
    const settings = await this.getSettings();
    return !!(
      settings?.is_enabled &&
      settings?.merchant_id &&
      settings?.secret_key &&
      settings?.client_key
    );
  },
};

