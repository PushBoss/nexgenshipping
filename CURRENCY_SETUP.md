# Currency Management - Setup Instructions

## Overview
Currency exchange rates management feature has been added to the admin panel. This feature allows admins to:
- View current exchange rates for USD, JMD, and CAD
- Update exchange rates manually
- Track the source (API or manual update) of each rate
- See when rates were last updated

## Prerequisites
The `currency_rates` table needs to be created in Supabase. Use the SQL migration below.

## Steps to Apply the Migration

### Option 1: Supabase Dashboard (Recommended)
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to your project: `nexgenshipping`
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the SQL from `/supabase/migrations/007_create_currency_rates.sql`
6. Paste it into the query editor
7. Click **Run**
8. Wait for the success message

### Option 2: Using Supabase CLI
```bash
cd /path/to/nexgenshipping
supabase link --project-ref erxkwytqautexizleeov
supabase db push
```

### Option 3: Manual SQL Execution
Copy and paste this SQL into Supabase SQL Editor:

```sql
-- Create currency_rates table
CREATE TABLE IF NOT EXISTS public.currency_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    currency VARCHAR(3) NOT NULL CHECK (currency IN ('JMD', 'CAD')),
    rate DECIMAL(10, 4) NOT NULL CHECK (rate > 0),
    source VARCHAR(50) DEFAULT 'manual',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    UNIQUE(currency)
);

-- Enable RLS
ALTER TABLE public.currency_rates ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "public_read_currency_rates" ON public.currency_rates
    FOR SELECT USING (true);

-- Admin insert/update policies
CREATE POLICY "admin_manage_currency_rates" ON public.currency_rates
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "admin_update_currency_rates" ON public.currency_rates
    FOR UPDATE USING (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Create index
CREATE INDEX IF NOT EXISTS idx_currency_rates_currency ON public.currency_rates(currency);

-- Insert default rates
INSERT INTO public.currency_rates (currency, rate, source) 
VALUES 
    ('JMD', 155.75, 'api'),
    ('CAD', 1.35, 'api')
ON CONFLICT (currency) DO NOTHING;
```

## Features

### Currency Tab in Admin Panel
The new **Currency** tab in the admin dashboard provides:

1. **Current Exchange Rates Table**
   - Shows USD (base currency, rate = 1.0)
   - Shows JMD and CAD with their current exchange rates
   - Displays the source of each rate (API or manual)
   - Shows the last update date

2. **Update Exchange Rates Form**
   - Input fields for JMD and CAD rates
   - Example values for reference
   - Validation to ensure rates are positive numbers
   - Save button to update rates in the database

3. **Automatic Rate Updates**
   - When the app loads, it checks for rates in the database first
   - Falls back to exchangerate-api.com if database rates exist but are old
   - Automatically saves API-fetched rates to the database for faster future loads

## How It Works

### For Users (Currency Switcher)
1. Click on the currency selector in the header (shows flag + currency code)
2. Choose USD, JMD, or CAD
3. All product prices automatically convert to the selected currency
4. The choice is saved in browser localStorage

### For Admins (Currency Management)
1. Go to Admin Panel → Currency tab
2. View current exchange rates
3. Update rates in the form
4. Click "Save Exchange Rates"
5. Changes take effect immediately for all users

### Rate Fetching Priority
1. **Database rates** (if available and updated within 24 hours)
2. **API rates** (from exchangerate-api.com, free tier)
3. **Cached rates** (from localStorage/memory)
4. **Fallback rates** (hardcoded defaults as last resort)

## Configuration
- Base currency: USD (rate = 1.0, cannot be changed)
- Supported currencies: USD, JMD, CAD
- Decimal places: 4 (e.g., 155.7500)
- Automatic cache expiration: 24 hours
- API: exchangerate-api.com (free tier, no authentication)

## Testing
1. Go to Admin Panel → Currency tab
2. Verify current rates are displayed
3. Update JMD rate to 160.00
4. Update CAD rate to 1.40
5. Click "Save Exchange Rates"
6. Verify the table updates immediately
7. Go to homepage
8. Switch currencies in header
9. Verify product prices update correctly

## Troubleshooting

### Table Not Found Error
**Error:** "relation 'public.currency_rates' does not exist"
**Solution:** Apply the SQL migration using one of the methods above

### Permission Denied Error
**Error:** "new row violates row level security policy"
**Solution:** Ensure your user account has the 'admin' role in auth.users raw_user_meta_data

### Rates Not Updating
1. Check browser console for errors
2. Verify the table exists: `SELECT * FROM public.currency_rates;` in SQL Editor
3. Try clearing browser cache and localStorage
4. Restart the application

## Files Modified
- `src/utils/currencyService.ts` - Updated to fetch rates from database
- `src/utils/currencyRatesService.ts` - New service for managing rates
- `src/components/AdminPage.tsx` - Added Currency tab
- `supabase/migrations/007_create_currency_rates.sql` - Database migration

## Next Steps
1. ✅ Code deployed to GitHub
2. ⏳ **Apply the migration to Supabase** (see instructions above)
3. ⏳ Test currency switching and admin updates
4. ✅ Feature ready to use!
