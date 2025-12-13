/**
 * DimePay Payment Form Component
 * Handles payment processing through DimePay gateway
 */

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { CreditCard, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  createDimePayPayment,
  calculateAmountWithFees,
  calculateFeeAmount,
  isDimePayConfigured,
} from '../utils/dimepayService';
import { paymentGatewayService } from '../utils/paymentGatewayService';
import { formatCurrency } from '../utils/currencyService';
import type { Currency } from '../utils/currencyService';

interface DimePayPaymentFormProps {
  amount: number; // Base amount in selected currency
  currency: Currency;
  customerEmail: string;
  customerName: string;
  onSuccess: () => void;
  onBack: () => void;
  orderId?: string;
}

export function DimePayPaymentForm({
  amount,
  currency,
  customerEmail,
  customerName,
  onSuccess,
  onBack,
  orderId,
}: DimePayPaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [feeInfo, setFeeInfo] = useState<{
    baseAmount: number;
    feeAmount: number;
    totalAmount: number;
    feeHandling: 'merchant' | 'customer';
  } | null>(null);

  useEffect(() => {
    // Check if DimePay is configured
    const checkConfiguration = async () => {
      const configured = await isDimePayConfigured();
      setIsConfigured(configured);

      if (configured) {
        // Load fee information
        const settings = await paymentGatewayService.getSettings();
        if (settings) {
          const baseAmountInCents = Math.round(amount * 100); // Convert to cents
          const feeAmt = calculateFeeAmount(
            baseAmountInCents,
            settings.platform_fee_percentage
          );
          const totalAmt = calculateAmountWithFees(
            baseAmountInCents,
            settings.platform_fee_percentage,
            settings.fee_handling
          );

          setFeeInfo({
            baseAmount: baseAmountInCents,
            feeAmount: feeAmt,
            totalAmount: totalAmt,
            feeHandling: settings.fee_handling,
          });
        }
      }
    };

    checkConfiguration();
  }, [amount]);

  const handlePayment = async () => {
    if (!isConfigured) {
      toast.error('Payment gateway is not configured. Please configure DimePay in admin settings.');
      return;
    }

    setIsProcessing(true);

    try {
      // Convert amount to cents (DimePay expects cents)
      const amountInCents = Math.round(amount * 100);

      const paymentResponse = await createDimePayPayment({
        amount: amountInCents,
        currency: currency,
        merchant_id: '', // Will be retrieved from settings in service
        customer_email: customerEmail,
        customer_name: customerName,
        order_id: orderId || `order-${Date.now()}`,
      });

      if (paymentResponse.success && paymentResponse.payment_url) {
        // Redirect to DimePay payment page
        window.location.href = paymentResponse.payment_url;
      } else {
        toast.error(paymentResponse.error || 'Failed to create payment');
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'An error occurred while processing payment');
      setIsProcessing(false);
    }
  };

  if (!isConfigured) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Payment gateway is not configured. Please configure DimePay in the admin settings.
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={onBack}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Base Amount:</span>
          <span className="font-medium">{formatCurrency(amount, currency)}</span>
        </div>
        {feeInfo && feeInfo.feeHandling === 'customer' && feeInfo.feeAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Platform Fee:</span>
            <span className="font-medium">
              {formatCurrency(feeInfo.feeAmount / 100, currency)}
            </span>
          </div>
        )}
        <div className="border-t pt-2 flex justify-between font-semibold">
          <span>Total Amount:</span>
          <span className="text-[#DC143C]">
            {formatCurrency(
              feeInfo ? feeInfo.totalAmount / 100 : amount,
              currency
            )}
          </span>
        </div>
        {feeInfo && feeInfo.feeHandling === 'merchant' && (
          <p className="text-xs text-gray-500 mt-2">
            Platform fees will be deducted from your payment
          </p>
        )}
      </div>

      {/* Payment Instructions */}
      <Alert>
        <CreditCard className="h-4 w-4" />
        <AlertDescription>
          You will be redirected to DimePay to complete your payment securely. After payment, you
          will be redirected back to confirm your order.
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} disabled={isProcessing}>
          Back
        </Button>
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="flex-1 bg-[#DC143C] hover:bg-[#B01030]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Proceed to Payment
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

