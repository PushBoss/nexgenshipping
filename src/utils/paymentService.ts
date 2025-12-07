import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';

/**
 * Payment Service - Handles Stripe payment processing
 * 
 * Setup Instructions:
 * 1. Get your Stripe publishable key from https://dashboard.stripe.com/apikeys
 * 2. Add it to your environment variables or config file
 * 3. For testing, use Stripe test keys (they start with pk_test_)
 * 4. For production, use live keys (they start with pk_live_)
 */

// Stripe publishable key - replace with your actual key
// For testing, use: pk_test_51xxxxx...
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Initialize Stripe with your publishable key
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    if (!STRIPE_PUBLISHABLE_KEY) {
      console.error('❌ Stripe publishable key is not configured');
      console.log('💡 Add VITE_STRIPE_PUBLISHABLE_KEY to your .env file');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * Check if Stripe is properly configured
 */
export const isStripeConfigured = (): boolean => {
  return !!STRIPE_PUBLISHABLE_KEY;
};

export interface PaymentDetails {
  amount: number; // Amount in cents (e.g., 1000 = $10.00)
  currency: string; // e.g., 'usd'
  customerEmail: string;
  customerName: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface PaymentResponse {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
  clientSecret?: string;
}

/**
 * Create a payment intent on your backend
 * This is a placeholder - you need to implement your backend endpoint
 */
export const createPaymentIntent = async (details: PaymentDetails): Promise<PaymentResponse> => {
  try {
    // TODO: Replace this with your actual backend endpoint
    // This should call your server which then calls Stripe's API
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(details),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const data = await response.json();
    
    return {
      success: true,
      paymentIntentId: data.paymentIntentId,
      clientSecret: data.clientSecret,
    };
  } catch (error: any) {
    console.error('Payment intent creation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create payment intent',
    };
  }
};

/**
 * Process a payment using Stripe Elements
 */
export const processPayment = async (
  stripe: Stripe,
  elements: StripeElements,
  _clientSecret: string, // Prefixed with _ to indicate intentionally unused
  customerDetails: {
    name: string;
    email: string;
    address?: {
      line1: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  }
): Promise<PaymentResponse> => {
  try {
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: customerDetails.name,
            email: customerDetails.email,
            address: customerDetails.address,
          },
        },
      },
      redirect: 'if_required',
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Payment failed',
      };
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      return {
        success: true,
        paymentIntentId: paymentIntent.id,
      };
    }

    return {
      success: false,
      error: 'Payment was not successful',
    };
  } catch (error: any) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: error.message || 'Failed to process payment',
    };
  }
};

/**
 * Format amount for display (cents to dollars)
 */
export const formatAmount = (amountInCents: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amountInCents / 100);
};

/**
 * Convert dollar amount to cents
 */
export const toCents = (amount: number): number => {
  return Math.round(amount * 100);
};

/**
 * Test card numbers for Stripe testing:
 * - Success: 4242 4242 4242 4242
 * - Declined: 4000 0000 0000 0002
 * - Requires 3D Secure: 4000 0025 0000 3155
 * - Use any future expiry date and any 3-digit CVC
 */
