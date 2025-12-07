# NEX-GEN Shipping Database Schema

## Overview
This database schema supports a full-featured e-commerce application for NEX-GEN Shipping Agency, including product catalog, user management, shopping cart, orders, inventory tracking, and analytics.

## Database Structure

### Core Tables

#### Users & Authentication
- **user_profiles** - Extended user information (linked to auth.users)
- **user_addresses** - Shipping and billing addresses
- **user_notification_preferences** - Email/SMS notification settings

#### Product Catalog
- **categories** - Hierarchical product categories
- **products** - Main product catalog with pricing, inventory, and search
- **product_reviews** - Customer reviews and ratings

#### Shopping & Orders
- **cart_items** - Active shopping cart items
- **wishlist_items** - User wishlists
- **orders** - Order header with shipping/payment details
- **order_items** - Individual items in each order

#### Inventory & Analytics
- **inventory_transactions** - Complete audit log of stock changes
- **product_sales_analytics** - Materialized view for sales reporting

## Key Features

### 1. Row Level Security (RLS)
All tables have RLS enabled with policies for:
- Public read access for products and categories
- User-specific access for carts, orders, and profiles
- Admin-only access for management functions

### 2. Automated Triggers
- **Updated timestamps** - Auto-update `updated_at` fields
- **Search vectors** - Full-text search indexing for products
- **Rating updates** - Auto-calculate product ratings from reviews
- **Inventory management** - Auto-update stock on order status changes
- **Order numbers** - Auto-generate unique order numbers (NG-YYYY-XXXXXX)

### 3. Inventory Tracking
- Real-time stock counts
- Automatic stock adjustments on order confirmation/cancellation
- Complete transaction history
- Low stock alerts (via queries)

### 4. Search Functionality
Full-text search using PostgreSQL's tsvector:
```sql
SELECT * FROM search_products('baby clothes', 'baby');
```

### 5. Analytics
Materialized view for sales analytics:
```sql
SELECT * FROM product_sales_analytics 
ORDER BY total_revenue DESC;
```

## Schema Diagram

```
auth.users (Supabase Auth)
    ↓
user_profiles (extends auth.users)
    ├── user_addresses
    ├── user_notification_preferences
    ├── orders
    │   └── order_items → products
    ├── cart_items → products
    ├── wishlist_items → products
    └── product_reviews → products

categories (hierarchical)
    └── products
        ├── order_items
        ├── cart_items
        ├── wishlist_items
        ├── product_reviews
        └── inventory_transactions
```

## Installation

### Option 1: Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `migrations/001_initial_schema.sql`
4. Click **Run** to execute

### Option 2: Supabase CLI
```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Or apply specific migration
supabase migration up
```

### Option 3: Local Development
```bash
# Start local Supabase instance
supabase start

# Apply migrations
supabase db reset
```

## Post-Installation

### 1. Enable Storage (for product images)
```sql
-- In Supabase Storage, create a bucket called 'product-images'
-- Set it to public read access
```

### 2. Create Admin User
```sql
-- After signing up a user, promote them to admin
UPDATE public.user_profiles 
SET is_admin = true 
WHERE id = 'user-uuid-here';
```

### 3. Refresh Analytics View
```sql
-- Refresh materialized view (can be scheduled)
REFRESH MATERIALIZED VIEW product_sales_analytics;
```

## Security Considerations

### Authentication Required
- Cart management
- Order placement
- Profile updates
- Reviews (create/edit)

### Public Access
- Browse products
- View categories
- Read reviews

### Admin Only
- Product management
- Category management
- View all orders
- Update order status
- Inventory adjustments

## API Usage Examples

### Get Products by Category
```typescript
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('category', 'baby')
  .eq('is_active', true)
  .order('rating', { ascending: false });
```

### Add to Cart
```typescript
const { data, error } = await supabase
  .from('cart_items')
  .insert({
    user_id: user.id,
    product_id: productId,
    quantity: 1
  });
```

### Create Order
```typescript
// 1. Create order
const { data: order, error } = await supabase
  .from('orders')
  .insert({
    user_id: user.id,
    subtotal: 100.00,
    tax: 8.00,
    shipping_cost: 9.99,
    total: 117.99,
    // ... shipping details
  })
  .select()
  .single();

// 2. Add order items
const { error: itemsError } = await supabase
  .from('order_items')
  .insert(cartItems.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.name,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity
  })));

// 3. Clear cart
await supabase
  .from('cart_items')
  .delete()
  .eq('user_id', user.id);
```

### Search Products
```typescript
const { data, error } = await supabase
  .rpc('search_products', {
    search_query: 'baby clothes',
    p_category: 'baby'
  });
```

## Performance Optimization

### Indexes
The schema includes comprehensive indexes on:
- Foreign keys
- Status fields
- Date fields (for sorting)
- Search vectors
- User-specific queries

### Materialized Views
- `product_sales_analytics` - Pre-computed sales metrics
- Refresh schedule recommended: Daily or on-demand

## Maintenance

### Regular Tasks
```sql
-- Refresh analytics (daily)
REFRESH MATERIALIZED VIEW product_sales_analytics;

-- Clean up old cart items (optional - items > 30 days old)
DELETE FROM cart_items 
WHERE updated_at < NOW() - INTERVAL '30 days';

-- Update product stock counts (if out of sync)
-- See inventory_transactions table for audit trail
```

## TypeScript Types

Generate types from schema:
```bash
supabase gen types typescript --project-id your-project-ref > src/types/database.types.ts
```

## Support & Documentation

- **Supabase Docs**: https://supabase.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Schema Version**: 1.0.0
- **Created**: December 2025

## Migration History

| Version | Date | Description |
|---------|------|-------------|
| 001 | Dec 2025 | Initial schema with full e-commerce features |

## Future Enhancements

Planned features for future migrations:
- Product variants (size, color)
- Discount codes/coupons
- Customer support tickets
- Email notification queue
- Product recommendations
- Subscription orders
