-- Add currency support to products table
-- This migration adds a currency field to products and sets default currency to USD

-- Add currency column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD' CHECK (currency IN ('USD', 'JMD', 'CAD'));

-- Update existing products to have USD currency (if they don't have one)
UPDATE public.products 
SET currency = 'USD' 
WHERE currency IS NULL;

-- Make currency NOT NULL after setting defaults
ALTER TABLE public.products 
ALTER COLUMN currency SET NOT NULL;

-- Create index for currency lookups
CREATE INDEX IF NOT EXISTS idx_products_currency ON public.products(currency);

-- Add comment for documentation
COMMENT ON COLUMN public.products.currency IS 'Product price currency code: USD, JMD, or CAD';

