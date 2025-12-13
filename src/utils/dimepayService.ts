/**
 * DimePay Payment Service
 * Handles payment processing through DimePay API
 */

import { paymentGatewayService, PaymentGatewaySettings } from './paymentGatewayService';
import { config } from './config';

export interface DimePayPaymentRequest {
  amount: number; // Amount in cents
  currency: string; // e.g., 'USD'
  merchant_id: string;
  customer_email: string;
  customer_name: string;
  order_id?: string;
  metadata?: Record<string, string>;
}

export interface DimePayPaymentResponse {
  success: boolean;
  transaction_id?: string;
  payment_url?: string;
  error?: string;
  message?: string;
}

export interface DimePayPaymentStatus {
  transaction_id: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
}

/**
 * Calculate total amount with fees (if customer pays fees)
 */
export function calculateAmountWithFees(
  baseAmount: number,
  feePercentage: number,
  feeHandling: 'merchant' | 'customer'
): number {
  if (feeHandling === 'merchant') {
    // Merchant absorbs fees, customer pays base amount
    return baseAmount;
  } else {
    // Customer pays base amount + fees
    const feeAmount = Math.round((baseAmount * feePercentage) / 100);
    return baseAmount + feeAmount;
  }
}

/**
 * Calculate fee amount
 */
export function calculateFeeAmount(baseAmount: number, feePercentage: number): number {
  return Math.round((baseAmount * feePercentage) / 100);
}

/**
 * Create a payment with DimePay
 */
export async function createDimePayPayment(
  request: DimePayPaymentRequest
): Promise<DimePayPaymentResponse> {
  try {
    // Get payment gateway settings
    const settings = await paymentGatewayService.getSettings();
    
    if (!settings || !settings.is_enabled || !settings.merchant_id || !settings.client_key) {
      return {
        success: false,
        error: 'Payment gateway is not configured. Please configure DimePay in admin settings.',
      };
    }

    const baseUrl = paymentGatewayService.getDimePayBaseUrl(settings.environment);
    
    // Calculate amount with fees
    const finalAmount = calculateAmountWithFees(
      request.amount,
      settings.platform_fee_percentage,
      settings.fee_handling
    );

    // Create payment request
    const paymentData = {
      amount: finalAmount,
      currency: request.currency.toUpperCase(),
      merchant_id: settings.merchant_id,
      customer_email: request.customer_email,
      customer_name: request.customer_name,
      order_id: request.order_id || `order-${Date.now()}`,
      metadata: request.metadata || {},
      return_url: `${window.location.origin}/order-confirmation`,
      cancel_url: `${window.location.origin}/checkout`,
    };

    const response = await fetch(`${baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'client_key': settings.client_key,
        'Authorization': `Bearer ${settings.secret_key}`,
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || 'Failed to create payment',
      };
    }

    return {
      success: true,
      transaction_id: data.transaction_id || data.id,
      payment_url: data.payment_url || data.checkout_url,
      message: data.message,
    };
  } catch (error: any) {
    console.error('DimePay payment creation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create payment. Please try again.',
    };
  }
}

/**
 * Check payment status
 */
export async function checkDimePayPaymentStatus(
  transactionId: string
): Promise<DimePayPaymentStatus | null> {
  try {
    const settings = await paymentGatewayService.getSettings();
    
    if (!settings || !settings.client_key) {
      return null;
    }

    const baseUrl = paymentGatewayService.getDimePayBaseUrl(settings.environment);

    const response = await fetch(`${baseUrl}/payments/${transactionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'client_key': settings.client_key,
        'Authorization': `Bearer ${settings.secret_key}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      transaction_id: data.transaction_id || data.id,
      status: data.status || 'pending',
      amount: data.amount,
      currency: data.currency,
    };
  } catch (error) {
    console.error('DimePay status check error:', error);
    return null;
  }
}

/**
 * Verify payment gateway is configured
 */
export async function isDimePayConfigured(): Promise<boolean> {
  return await paymentGatewayService.isConfigured();
}

