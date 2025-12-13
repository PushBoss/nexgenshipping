# Fixing CORS Error for Supabase Auth

## Problem
You're seeing this error when trying to sign up or sign in:
```
Access to fetch at 'https://erxkwytqautexizleeov.supabase.co/auth/v1/signup' from origin 'http://localhost:3000' has been blocked by CORS policy
```

## Solution 1: Configure CORS in Supabase Dashboard (Recommended)

### Step 1: Go to Supabase Dashboard
1. Visit: https://app.supabase.com
2. Select your project: `erxkwytqautexizleeov`

### Step 2: Configure Authentication URLs
1. Navigate to **Authentication** → **URL Configuration**
2. In **"Redirect URLs"** section, add:
   ```
   http://localhost:3000/**
   http://localhost:3000
   ```
3. In **"Site URL"** field, set:
   ```
   http://localhost:3000
   ```
4. Click **Save**

### Step 3: Verify Configuration
- Make sure **"Enable email signups"** is enabled
- Make sure **"Confirm email"** is set according to your preference (can be disabled for testing)

## Solution 2: Use Edge Functions (Already Implemented)

The code has been updated to automatically try Edge Functions first, which bypass CORS. However, you need to deploy the Edge Functions:

### Deploy Edge Functions

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref erxkwytqautexizleeov
   ```

4. **Deploy the auth functions**:
   ```bash
   supabase functions deploy auth-signup
   supabase functions deploy auth-signin
   ```

5. **Set environment variables** (required):
   ```bash
   supabase secrets set SUPABASE_URL=https://erxkwytqautexizleeov.supabase.co
   supabase secrets set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyeGt3eXRxYXV0ZXhpemxlZW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NDc4NTAsImV4cCI6MjA4MDEyMzg1MH0.IeKfNvkLNVxvtX-dl8U9xqlv3LIzX6AHLpqiZRcvjVs
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
   
   **To find your Service Role Key:**
   - Go to Supabase Dashboard → Settings → API
   - Copy the "service_role" key (keep this secret!)

### How It Works
- The app will first try to use Edge Functions (`/functions/v1/auth-signup` and `/functions/v1/auth-signin`)
- If Edge Functions are not deployed or fail, it falls back to direct Supabase Auth
- Edge Functions run server-side, so they bypass CORS restrictions

## Solution 3: Quick Fix - Disable Email Confirmation (For Testing)

If you just need to test quickly:

1. Go to Supabase Dashboard → **Authentication** → **Providers** → **Email**
2. Disable **"Confirm email"** temporarily
3. Add `http://localhost:3000` to Redirect URLs (as in Solution 1)

## Verification

After applying Solution 1 or 2, try signing up again. The CORS error should be resolved.

## For Production Deployment

When deploying to Vercel or another platform:

1. Add your production URL to Supabase Redirect URLs:
   ```
   https://yourdomain.com/**
   https://yourdomain.com
   ```

2. Update Site URL to your production domain

3. Make sure Edge Functions are deployed (if using Solution 2)

