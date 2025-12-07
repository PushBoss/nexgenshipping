-- Migration: Change product ID from UUID to TEXT to support numeric IDs
-- This allows both UUID and numeric IDs to coexist

BEGIN;

-- Step 0: Drop materialized view that depends on products.id
DROP MATERIALIZED VIEW IF EXISTS public.product_sales_analytics;

-- Step 1: Drop foreign key constraints that reference products.id
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
ALTER TABLE public.cart_items DROP CONSTRAINT IF EXISTS cart_items_product_id_fkey;
ALTER TABLE public.wishlist_items DROP CONSTRAINT IF EXISTS wishlist_items_product_id_fkey;
ALTER TABLE public.product_reviews DROP CONSTRAINT IF EXISTS product_reviews_product_id_fkey;
ALTER TABLE public.inventory_transactions DROP CONSTRAINT IF EXISTS inventory_transactions_product_id_fkey;

-- Step 2: Change products.id from UUID to TEXT
ALTER TABLE public.products 
  ALTER COLUMN id TYPE TEXT USING id::TEXT;

-- Step 3: Change foreign key columns to TEXT
ALTER TABLE public.order_items 
  ALTER COLUMN product_id TYPE TEXT USING product_id::TEXT;

ALTER TABLE public.cart_items 
  ALTER COLUMN product_id TYPE TEXT USING product_id::TEXT;

ALTER TABLE public.wishlist_items 
  ALTER COLUMN product_id TYPE TEXT USING product_id::TEXT;

ALTER TABLE public.product_reviews 
  ALTER COLUMN product_id TYPE TEXT USING product_id::TEXT;

ALTER TABLE public.inventory_transactions 
  ALTER COLUMN product_id TYPE TEXT USING product_id::TEXT;

-- Step 4: Recreate foreign key constraints
ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES public.products(id);

ALTER TABLE public.cart_items
  ADD CONSTRAINT cart_items_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

ALTER TABLE public.wishlist_items
  ADD CONSTRAINT wishlist_items_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

ALTER TABLE public.product_reviews
  ADD CONSTRAINT product_reviews_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

ALTER TABLE public.inventory_transactions
  ADD CONSTRAINT inventory_transactions_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

-- Step 5: Recreate materialized view with TEXT product_id
CREATE MATERIALIZED VIEW public.product_sales_analytics AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.category,
    COUNT(DISTINCT oi.order_id) as total_orders,
    SUM(oi.quantity) as total_units_sold,
    SUM(oi.total_price) as total_revenue,
    AVG(oi.unit_price) as average_price,
    MAX(o.created_at) as last_sale_date
FROM public.products p
LEFT JOIN public.order_items oi ON p.id = oi.product_id
LEFT JOIN public.orders o ON oi.order_id = o.id
WHERE o.status != 'cancelled'
GROUP BY p.id, p.name, p.category;

COMMIT;
