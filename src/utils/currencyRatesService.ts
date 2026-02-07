/**
 * Currency Rates Service - Manages exchange rates in Supabase database
 */

import { supabase } from './supabaseClient';
import { Currency } from './currencyService';

export interface CurrencyRate {
  id: string;
  currency: Currency;
  rate: number;
  source: 'api' | 'manual';
  updated_at: string;
  updated_by_user_id?: string;
}

export const currencyRatesService = {
  /**
   * Get all exchange rates from database
   */
  async getRates(): Promise<Record<Currency, number>> {
    try {
      const { data, error } = await supabase
        .from('currency_rates')
        .select('currency, rate')
        .in('currency', ['JMD', 'CAD']);

      if (error) throw error;

      const rates: Record<string, number> = {
        USD: 1.0, // Base currency
      };

      if (data) {
        data.forEach((row: any) => {
          rates[row.currency] = row.rate;
        });
      }

      return rates as Record<Currency, number>;
    } catch (error) {
      console.error('Error fetching currency rates:', error);
      // Return null to trigger fallback to API/cache
      return null as any;
    }
  },

  /**
   * Get a single currency rate
   */
  async getRate(currency: Currency): Promise<number | null> {
    if (currency === 'USD') return 1.0;

    try {
      const { data, error } = await supabase
        .from('currency_rates')
        .select('rate')
        .eq('currency', currency)
        .single();

      if (error) {
        console.error(`Error fetching ${currency} rate:`, error);
        return null;
      }

      return data?.rate || null;
    } catch (error) {
      console.error('Error fetching currency rate:', error);
      return null;
    }
  },

  /**
   * Update a currency rate (admin only)
   */
  async updateRate(currency: Currency, rate: number, source: 'api' | 'manual' = 'manual'): Promise<CurrencyRate | null> {
    if (currency === 'USD') {
      throw new Error('Cannot update USD rate (base currency)');
    }

    if (rate <= 0) {
      throw new Error('Rate must be greater than 0');
    }

    try {
      const { data, error } = await supabase
        .from('currency_rates')
        .update({
          rate,
          source,
          updated_at: new Date().toISOString(),
          updated_by_user_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('currency', currency)
        .select()
        .single();

      if (error) throw error;

      console.log(`✅ Updated ${currency} rate to ${rate}`);
      return data;
    } catch (error) {
      console.error(`Error updating ${currency} rate:`, error);
      throw error;
    }
  },

  /**
   * Batch update multiple rates
   */
  async updateRates(rates: Record<Currency, number>, source: 'api' | 'manual' = 'manual'): Promise<CurrencyRate[]> {
    const updates = [];

    for (const [currency, rate] of Object.entries(rates)) {
      if (currency !== 'USD' && rate > 0) {
        updates.push(
          this.updateRate(currency as Currency, rate, source)
        );
      }
    }

    return Promise.all(updates);
  },

  /**
   * Get all rates with metadata (for admin viewing)
   */
  async getAllRatesWithMetadata(): Promise<CurrencyRate[]> {
    try {
      const { data, error } = await supabase
        .from('currency_rates')
        .select('*')
        .order('currency', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching rates with metadata:', error);
      throw error;
    }
  },

  /**
   * Check if database has currency rates (for migration/setup)
   */
  async hasCurrencyRatesTable(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('currency_rates')
        .select('count', { count: 'exact', head: true });

      return !error;
    } catch {
      return false;
    }
  },
};
