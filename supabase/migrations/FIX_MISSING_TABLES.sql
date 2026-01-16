-- 1. Helper Function to Run SQL (Critical for future updates)
CREATE OR REPLACE FUNCTION public.exec_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;

-- 2. Reviews Table (for Rating System)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    user_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Reviews Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Reviews are viewable by everyone') THEN
        CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Users can insert their own reviews') THEN
        CREATE POLICY "Users can insert their own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Users can update their own reviews') THEN
        CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Users can delete their own reviews') THEN
        CREATE POLICY "Users can delete their own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Reviews Rating Update Function
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating NUMERIC;
    count_reviews INTEGER;
BEGIN
    SELECT AVG(rating)::NUMERIC(3,2), COUNT(*)
    INTO avg_rating, count_reviews
    FROM public.reviews
    WHERE product_id = COALESCE(NEW.product_id, OLD.product_id);

    UPDATE public.products
    SET rating = COALESCE(avg_rating, 0),
        review_count = COALESCE(count_reviews, 0)
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reviews Trigger
DROP TRIGGER IF EXISTS on_review_change ON public.reviews;
CREATE TRIGGER on_review_change
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_product_rating();


-- 3. Payment Gateway Settings Table
CREATE TABLE IF NOT EXISTS public.payment_gateway_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id VARCHAR(255),
    secret_key VARCHAR(500),
    client_key VARCHAR(500),
    environment VARCHAR(20) DEFAULT 'sandbox' CHECK (environment IN ('sandbox', 'production')),
    fee_handling VARCHAR(20) DEFAULT 'merchant' CHECK (fee_handling IN ('merchant', 'customer')),
    platform_fee_percentage DECIMAL(5, 2) DEFAULT 2.90 CHECK (platform_fee_percentage >= 0),
    is_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = '00000000-0000-0000-0000-000000000001'::uuid)
);

-- Insert Default Payment Settings Row
INSERT INTO public.payment_gateway_settings (id, merchant_id, secret_key, client_key, environment, fee_handling, platform_fee_percentage, is_enabled)
VALUES ('00000000-0000-0000-0000-000000000001'::uuid, NULL, NULL, NULL, 'sandbox', 'merchant', 2.90, false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for Payment Settings
ALTER TABLE public.payment_gateway_settings ENABLE ROW LEVEL SECURITY;

-- Payment Settings Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_gateway_settings' AND policyname = 'Admins can view payment gateway settings') THEN
        CREATE POLICY "Admins can view payment gateway settings" ON public.payment_gateway_settings FOR SELECT
        USING ( EXISTS ( SELECT 1 FROM public.user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.is_admin = true ) );
    END IF;
END $$;
