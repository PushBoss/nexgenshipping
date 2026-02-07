-- Create currency_rates table to store and manage exchange rates
-- Admin can update these rates manually or they are auto-updated from API

-- Create table
CREATE TABLE IF NOT EXISTS public.currency_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    currency VARCHAR(3) NOT NULL CHECK (currency IN ('JMD', 'CAD')),
    rate DECIMAL(10, 4) NOT NULL CHECK (rate > 0),
    source VARCHAR(50) DEFAULT 'manual', -- 'api' or 'manual'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    UNIQUE(currency)
);

-- Enable RLS
ALTER TABLE public.currency_rates ENABLE ROW LEVEL SECURITY;

-- Policies for currency_rates table
-- Allow anyone to SELECT rates (for price conversion)
CREATE POLICY "public_read_currency_rates" ON public.currency_rates
    FOR SELECT USING (true);

-- Allow authenticated users to INSERT/UPDATE rates (admin check done in app business logic)
CREATE POLICY "authenticated_insert_currency_rates" ON public.currency_rates
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_update_currency_rates" ON public.currency_rates
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_currency_rates_currency ON public.currency_rates(currency);

-- Insert default rates (USD base = 1.0, will be updated if different currency needed)
INSERT INTO public.currency_rates (currency, rate, source) 
VALUES 
    ('JMD', 155.75, 'api'),
    ('CAD', 1.35, 'api')
ON CONFLICT (currency) DO NOTHING;

-- Add comment
COMMENT ON TABLE public.currency_rates IS 'Exchange rates for currency conversion. Base currency is USD (rate = 1.0). Updated manually by admin or automatically from API.';
COMMENT ON COLUMN public.currency_rates.source IS 'Source of rate: "api" for automatic API fetch, "manual" for admin update';
