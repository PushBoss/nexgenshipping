-- Migration: Change product ID from UUID to TEXT to support numeric IDs
-- This allows both UUID and numeric IDs to coexist

BEGIN;

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

COMMIT;
