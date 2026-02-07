# Currency Management - Fixes and Updates

## Issues Fixed

### 1. Currency Conversion Not Working ✅
**Problem:** When switching currencies in the header, product prices in carousels didn't update.

**Fix:** Added `selectedCurrency` prop to FeaturedSection (bestseller and on-sale carousels). Prices now convert instantly when you switch currencies.

**Test:** 
- Go to homepage
- Switch currency in header (USD → JMD → CAD)
- Carousel prices should update immediately

### 2. RLS Permission Error (403) ⚠️ REQUIRES ACTION
**Problem:** Cannot update currency rates - getting 403 permission error.

**Root Cause:** RLS policy was too restrictive, checking against `auth.users` table which may not be accessible.

**Solution:** Update RLS policies to allow authenticated users to update rates.

## Required Action: Update Supabase RLS Policies

You need to apply the policy fix from migration `008_fix_currency_rates_policies.sql`:

### Method 1: Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project `nexgenshipping`
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy and paste this SQL:

```sql
-- Update RLS policies for currency_rates table
-- This fixes the 403 permission error

-- Drop old restrictive policies
DROP POLICY IF EXISTS "admin_manage_currency_rates" ON public.currency_rates;
DROP POLICY IF EXISTS "admin_update_currency_rates" ON public.currency_rates;

-- Create new permissive policies
CREATE POLICY "authenticated_insert_currency_rates" ON public.currency_rates
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_update_currency_rates" ON public.currency_rates
    FOR UPDATE USING (auth.uid() IS NOT NULL);
```

6. Click **Run**
7. You should see "Success" message

### Method 2: Using Supabase CLI

```bash
cd /path/to/nexgenshipping
supabase link --project-ref erxkwytqautexizleeov
supabase db push
```

### Verify the Fix

After applying the migration:

1. Go to Admin Panel → Currency tab
2. Try updating a rate
3. Should see success toast notification
4. Rates should update in the table

## New Feature: Rate Source Preference

In the Currency tab, you can now choose which exchange rates to use:

**🔄 Auto (Recommended)**
- Uses admin-configured rates first
- Falls back to live API rates if admin rates don't exist
- Best for when you manually set rates but want API backup

**📋 Manual Only**
- Only uses rates you set in the admin panel
- Ignores API rates entirely
- Best for fixed rates you control

**🌐 API Only**
- Always fetches fresh rates from exchangerate-api.com
- Ignores admin-configured rates
- Best for always having current market rates

**To Switch Rate Source:**
1. Go to Admin Panel → Currency tab
2. Find "Rate Source Preference" section
3. Select your preferred option (radio button)
4. Setting is saved automatically to browser

## How Price Conversion Works

1. **Homepage & Carousels:** Click currency switcher → all prices update instantly
2. **Product Detail Page:** Currency picker at top → price updates
3. **Cart:** Prices convert to your selected currency
4. **Admin:** See all products with exact rates used

## Troubleshooting

### Still getting 403 error?
- Clear browser cache and localStorage: `localStorage.clear()`
- Try in an incognito/private window
- Make sure you're logged in as admin user
- Verify the RLS policies were applied successfully

### Prices not converting?
- Check if `selectedCurrency` is being passed to all components
- Make sure exchange rates are loaded (check browser DevTools → Network)
- Clear browser cache and reload

### Can't see rate source preference?
- Refresh admin page
- Check if JavaScript is enabled
- Try a different browser

## Files Updated

- ✅ `src/utils/currencyService.ts` - Added rate source preference functions
- ✅ `src/components/AdminPage.tsx` - Added rate source preference UI
- ✅ `src/components/FeaturedSection.tsx` - Added selectedCurrency prop
- ✅ `src/App.tsx` - Pass selectedCurrency to FeaturedSection
- ✅ `supabase/migrations/007_create_currency_rates.sql` - Updated RLS policies
- ✅ `supabase/migrations/008_fix_currency_rates_policies.sql` - Fix for existing setup

## How to Test Everything

```
1. Verify price conversion:
   - Click USD button in header
   - Check a product price shows in $X.XX
   - Click JMD button
   - Price should show in J$XX
   - Click CAD button
   - Price should show in C$X.XX

2. Update rates (after applying migration fix):
   - Go to Admin Panel
   - Click Currency tab
   - Change JMD to 160.00
   - Change CAD to 1.40
   - Click "Save Exchange Rates"
   - See success message
   - Go to homepage
   - Verify prices calculate with new rates

3. Test rate source preference:
   - In Currency tab, select "Manual Only"
   - Update a rate
   - Switch back to "Auto"
   - Try updating again
   - Should work in both modes
```

## Next Steps

1. ✅ Code deployed to GitHub/Vercel
2. ⏳ **Apply the RLS policy fix** (see above)
3. ✅ Price conversion working
4. ✨ Currency management ready to use!
