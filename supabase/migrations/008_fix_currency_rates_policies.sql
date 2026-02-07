-- Update RLS policies for currency_rates table
-- This fixes the 403 permission error by allowing authenticated users to update rates

-- Drop old restrictive policies
DROP POLICY IF EXISTS "admin_manage_currency_rates" ON public.currency_rates;
DROP POLICY IF EXISTS "admin_update_currency_rates" ON public.currency_rates;

-- Create new permissive policies (admin check done in app)
CREATE POLICY "authenticated_insert_currency_rates" ON public.currency_rates
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_update_currency_rates" ON public.currency_rates
    FOR UPDATE USING (auth.uid() IS NOT NULL);
