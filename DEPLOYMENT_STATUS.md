# Supabase Edge Functions Deployment Status

## Current Status
✅ **Homebrew**: Installed and working  
✅ **Supabase CLI**: Installed (v2.65.5) via Homebrew  
✅ **Edge Functions**: Created and ready (`auth-signup`, `auth-signin`)  
⚠️ **Project Access**: Need admin access to `erxkwytqautexizleeov` to deploy

## Quick Fix: Configure CORS (Recommended - No Deployment Needed)

This is the **fastest solution** and doesn't require deploying Edge Functions:

1. Go to https://app.supabase.com
2. Select project: `erxkwytqautexizleeov`
3. Navigate to **Authentication** → **URL Configuration**
4. Add to **Redirect URLs**:
   ```
   http://localhost:3000/**
   http://localhost:3000
   ```
5. Set **Site URL** to: `http://localhost:3000`
6. Click **Save**

This will immediately fix the CORS error!

## Deploy Edge Functions (Alternative Solution)

If you want to use Edge Functions instead, you'll need:

### Step 1: Get Project Access
- Contact the project owner to grant you admin access
- Or use a project you own

### Step 2: Link Project
```bash
cd /Users/aarongardiner/Desktop/nexgenshipping-main
supabase link --project-ref erxkwytqautexizleeov
```

### Step 3: Set Secrets
Get your keys from Supabase Dashboard → Settings → API:

```bash
# Set Supabase URL
supabase secrets set SUPABASE_URL=https://erxkwytqautexizleeov.supabase.co

# Set Anon Key (public, safe to share)
supabase secrets set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyeGt3eXRxYXV0ZXhpemxlZW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NDc4NTAsImV4cCI6MjA4MDEyMzg1MH0.IeKfNvkLNVxvtX-dl8U9xqlv3LIzX6AHLpqiZRcvjVs

# Set Service Role Key (KEEP SECRET!)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 4: Deploy Functions
```bash
supabase functions deploy auth-signup
supabase functions deploy auth-signin
```

## Verification

After either solution:
1. Try signing up at http://localhost:3000
2. The CORS error should be gone
3. Authentication should work smoothly

## Current Setup

- **Homebrew**: ✅ Installed at `/usr/local/bin/brew`
- **Supabase CLI**: ✅ Installed at `/usr/local/bin/supabase` (v2.65.5)
- **Edge Functions**: ✅ Ready in `supabase/functions/`
  - `auth-signup/index.ts`
  - `auth-signin/index.ts`

## Next Steps

**Recommended**: Use **Option 1** (Configure CORS) - it's instant and requires no deployment.

If you prefer Edge Functions, get project access first, then follow Step 2-4 above.

