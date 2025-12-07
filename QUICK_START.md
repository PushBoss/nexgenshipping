# Quick Start Guide - NEX-GEN Shipping

## 🚀 Get Started in 5 Minutes

### 1️⃣ Database Setup (2 minutes)
```bash
# Go to Supabase Dashboard
https://supabase.com/dashboard/project/erxkwytqautexizleeov

# Click "SQL Editor" → "New query"
# Copy/paste content from: supabase/migrations/001_initial_schema.sql
# Click "Run" ✅
```

### 2️⃣ Stripe Configuration (2 minutes)
```bash
# Get your test key from Stripe
https://dashboard.stripe.com/test/apikeys

# Create .env file
cp .env.example .env

# Add your key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE

# Restart server
npm run dev
```

### 3️⃣ Test Everything (1 minute)

**Test Account Creation:**
1. Click "Login" in header
2. Go to "Sign Up" tab
3. Enter email and password
4. Check browser console (F12) for debug logs
5. Look for success message

**Test Payment:**
1. Add product to cart
2. Go to checkout
3. Fill shipping info
4. Use test card: `4242 4242 4242 4242`
5. Expiry: `12/25`, CVC: `123`
6. Complete payment

---

## 🐛 Common Issues

### "Create Account button does nothing"
**Solution:**
1. Open browser console (F12)
2. Look for error messages
3. Check if database schema is deployed
4. Verify Supabase connection in config

### "Stripe not configured"
**Solution:**
1. Make sure `.env` file exists
2. Check `VITE_STRIPE_PUBLISHABLE_KEY` is set
3. Restart dev server with `npm run dev`

### "Payment intent creation failed"
**Solution:**
1. Deploy the Supabase function:
   ```bash
   supabase functions deploy create-payment-intent
   supabase secrets set STRIPE_SECRET_KEY=sk_test_...
   ```
2. OR set up your own backend endpoint

---

## 📝 Test Cards

| Card Number | Result |
|-------------|--------|
| 4242 4242 4242 4242 | ✅ Success |
| 4000 0000 0000 0002 | ❌ Declined |
| 4000 0025 0000 3155 | 🔒 3D Secure |

**Always use:**
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)

---

## 🔍 Debug Console Logs

When creating an account, you'll see:
```
🔵 Sign up form submitted
🔵 Starting sign up process for: user@example.com
🔵 Using Supabase authentication
🔵 Sign up result: {success: true}
🔵 Sign up process completed
```

If something fails:
```
❌ Sign up failed: [error message]
```

---

## 📚 Full Documentation

- **Database:** `DATABASE_SETUP_GUIDE.md`
- **Payments:** `STRIPE_SETUP_GUIDE.md`
- **Complete Overview:** `IMPLEMENTATION_COMPLETE.md`

---

## ✅ Checklist

- [ ] Database schema deployed
- [ ] `.env` file created with Stripe key
- [ ] Dev server restarted
- [ ] Test account creation works
- [ ] Test payment works

---

**Need Help?** Check the console logs first! They show exactly what's happening.
