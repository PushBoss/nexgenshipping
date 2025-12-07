# Stripe Payment Integration Guide

## ✅ What's Been Configured

The NEX-GEN Shipping application now has full Stripe payment integration! Here's what has been set up:

### 1. **Installed Dependencies**
- `@stripe/stripe-js` - Client-side Stripe library
- `stripe` - Stripe Node.js library for backend

### 2. **Payment Service** (`src/utils/paymentService.ts`)
- Stripe initialization with publishable key
- Payment intent creation helpers
- Amount formatting utilities
- Test card information

### 3. **Stripe Payment Form** (`src/components/StripePaymentForm.tsx`)
- Secure payment form using Stripe Elements
- Built-in card validation
- Support for multiple payment methods (card, PayPal)
- Real-time error handling

### 4. **Updated Checkout Page** (`src/components/CheckoutPage.tsx`)
- Integrated Stripe Elements
- 3-step checkout flow with payment integration
- Configuration status checking
- Loading states and error handling

### 5. **Backend Function Template** (`supabase/functions/create-payment-intent/index.ts`)
- Supabase Edge Function for creating payment intents
- Secure server-side payment processing
- CORS configuration

---

## 🚀 Setup Instructions

### Step 1: Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Sign up or log in to your Stripe account
3. Navigate to **Developers > API keys**
4. Copy your **Publishable key** (starts with `pk_test_...` for testing)
5. Copy your **Secret key** (starts with `sk_test_...` for testing)

> **Important**: Use test keys during development, switch to live keys for production!

### Step 2: Configure Environment Variables

1. Create a `.env` file in your project root:
   ```bash
   cp .env.example .env
   ```

2. Add your Stripe publishable key:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxxxxxxxxxx
   ```

3. **Never commit your `.env` file to version control!** (It's already in `.gitignore`)

### Step 3: Set Up Backend (Choose One Option)

#### **Option A: Using Supabase Edge Functions (Recommended)**

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref erxkwytqautexizleeov
   ```

4. Deploy the payment function:
   ```bash
   supabase functions deploy create-payment-intent
   ```

5. Set your Stripe secret key:
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   ```

6. Update `src/utils/paymentService.ts` line 66 with your Supabase function URL:
   ```typescript
   const response = await fetch('https://erxkwytqautexizleeov.supabase.co/functions/v1/create-payment-intent', {
   ```

#### **Option B: Using Your Own Backend**

If you have a Node.js/Express backend:

1. Install Stripe on your backend:
   ```bash
   npm install stripe
   ```

2. Create an endpoint (example):
   ```javascript
   const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

   app.post('/api/create-payment-intent', async (req, res) => {
     try {
       const { amount, currency, customerEmail, customerName, metadata } = req.body;

       const paymentIntent = await stripe.paymentIntents.create({
         amount: Math.round(amount),
         currency: currency || 'usd',
         automatic_payment_methods: { enabled: true },
         receipt_email: customerEmail,
         metadata: { customer_name: customerName, ...metadata },
       });

       res.json({
         clientSecret: paymentIntent.client_secret,
         paymentIntentId: paymentIntent.id,
       });
     } catch (error) {
       res.status(400).json({ error: error.message });
     }
   });
   ```

3. Update the fetch URL in `src/utils/paymentService.ts` to point to your backend

### Step 4: Restart Development Server

```bash
npm run dev
```

The app will now use Stripe for payments!

---

## 🧪 Testing Payments

Use these Stripe test cards (they won't charge real money):

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | ✅ Success |
| `4000 0000 0000 0002` | ❌ Declined |
| `4000 0025 0000 3155` | 🔒 Requires 3D Secure |

**For all test cards:**
- Use any **future expiry date** (e.g., 12/25)
- Use any **3-digit CVC** (e.g., 123)
- Use any **postal code** (e.g., 12345)

---

## 📝 How It Works

1. **Customer enters shipping info** → Proceeds to payment
2. **Frontend requests payment intent** → Calls your backend
3. **Backend creates payment intent** → Uses Stripe secret key
4. **Frontend receives client secret** → Initializes Stripe Elements
5. **Customer enters payment details** → Securely handled by Stripe
6. **Payment is processed** → Stripe charges the card
7. **Order confirmation** → Customer sees success message

---

## 🔒 Security Best Practices

✅ **Publishable key** (`pk_test_...`) → Safe to expose in frontend  
❌ **Secret key** (`sk_test_...`) → NEVER expose to frontend, only use on backend  
✅ **PCI compliance** → Stripe handles all sensitive card data  
✅ **HTTPS required** → Always use HTTPS in production  

---

## 🌐 Production Checklist

Before going live, make sure to:

- [ ] Switch from test keys to live keys
- [ ] Set up webhook endpoints for payment events
- [ ] Configure production domain in Stripe Dashboard
- [ ] Test 3D Secure authentication flow
- [ ] Set up proper error logging
- [ ] Add order confirmation emails
- [ ] Configure refund policy in Stripe

---

## 🐛 Troubleshooting

### "Stripe publishable key is not configured"
- Make sure your `.env` file has `VITE_STRIPE_PUBLISHABLE_KEY`
- Restart your dev server after adding the key

### "Failed to create payment intent"
- Check that your backend is running
- Verify the endpoint URL in `paymentService.ts`
- Check browser console for detailed error messages

### Payment succeeds but order doesn't complete
- Check that `handlePaymentSuccess` is being called
- Look for JavaScript errors in the console

---

## 💡 Alternative: Dime Payment Gateway

If you prefer to use Dime instead of Stripe:

1. Replace Stripe SDK with Dime's SDK
2. Update `paymentService.ts` with Dime API calls
3. Replace `StripePaymentForm.tsx` with Dime's payment form
4. Update environment variables for Dime API keys

> **Note**: Stripe is recommended as it has better documentation and broader support.

---

## 📚 Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Elements](https://stripe.com/docs/stripe-js)
- [Payment Intents API](https://stripe.com/docs/payments/payment-intents)

---

## 🎉 You're All Set!

Your NEX-GEN Shipping store can now accept real payments! Just add your API keys and you're ready to go.

For questions or issues, check the Stripe dashboard or review the integration code in:
- `src/utils/paymentService.ts`
- `src/components/CheckoutPage.tsx`
- `src/components/StripePaymentForm.tsx`
