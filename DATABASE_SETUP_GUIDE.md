# Database Setup Guide

## 📋 Overview

Your NEX-GEN Shipping application has a complete PostgreSQL database schema ready to deploy to Supabase. The schema includes:

- ✅ User profiles and addresses
- ✅ Products with full-text search
- ✅ Shopping cart and wishlist
- ✅ Orders and order items
- ✅ Product reviews and ratings
- ✅ Inventory tracking
- ✅ Notification preferences
- ✅ Row Level Security (RLS) policies
- ✅ Automatic triggers for ratings and inventory

---

## 🚀 Deploying to Supabase

### Method 1: Using Supabase Dashboard (Easiest)

1. **Go to your Supabase project**:
   - Visit [https://supabase.com/dashboard/project/erxkwytqautexizleeov](https://supabase.com/dashboard/project/erxkwytqautexizleeov)

2. **Open SQL Editor**:
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and paste the schema**:
   - Open `supabase/migrations/001_initial_schema.sql`
   - Copy the entire contents
   - Paste into the SQL Editor

4. **Run the migration**:
   - Click "Run" (or press Ctrl/Cmd + Enter)
   - Wait for success message

5. **Verify tables were created**:
   - Go to "Table Editor" in left sidebar
   - You should see all 12 tables

---

### Method 2: Using Supabase CLI (Advanced)

1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref erxkwytqautexizleeov
   ```

4. **Push the migration**:
   ```bash
   supabase db push
   ```

---

## 📊 Database Tables

Here's what gets created:

### Core Tables
1. **user_profiles** - Extended user information
2. **user_addresses** - Shipping/billing addresses
3. **user_notification_preferences** - Email/SMS settings

### Product Tables
4. **products** - Main product catalog with full-text search
5. **inventory** - Stock tracking
6. **product_reviews** - Customer reviews and ratings

### Shopping Tables
7. **cart_items** - Active shopping carts
8. **wishlist_items** - Saved for later

### Order Tables
9. **orders** - Order header information
10. **order_items** - Individual items in orders
11. **order_status_history** - Status tracking
12. **payment_transactions** - Payment records

---

## 🔒 Security Features

### Row Level Security (RLS)

All tables have RLS enabled with policies for:

- ✅ **Users** can only see their own data
- ✅ **Admins** can see all data
- ✅ **Public** can view products
- ✅ **Authenticated users** can create orders

### Admin Detection

Admins are identified by email domain:
- `admin@nexgenshipping.net`
- Or any `@nexgenshipping.net` email

To make yourself an admin:
```sql
UPDATE public.user_profiles 
SET is_admin = true 
WHERE id = 'your-user-id';
```

---

## 🔄 Automatic Features

### Triggers

1. **Update product ratings** - Recalculates average when reviews are added
2. **Decrement inventory** - Reduces stock when orders are placed
3. **Update timestamps** - Sets `updated_at` automatically

### Full-Text Search

Products have a `tsv` (text search vector) column for fast searching:
```sql
SELECT * FROM products 
WHERE tsv @@ to_tsquery('marine & equipment');
```

---

## ✅ Verification Steps

After deploying, verify everything works:

1. **Check tables exist**:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

2. **Test RLS policies**:
   - Try inserting a cart item as authenticated user
   - Try viewing products as anonymous user

3. **Test triggers**:
   - Add a product review
   - Check that product rating updated automatically

---

## 🐛 Troubleshooting

### "Permission denied for schema public"
- Make sure you're connected as the database owner
- Check that RLS policies are correctly configured

### "Relation already exists"
- The tables were already created
- You can drop and recreate, or modify existing tables

### "Function does not exist"
- Make sure the UUID extension is enabled
- Run: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

---

## 📝 Next Steps

After deploying the schema:

1. ✅ Products will automatically save to database when added via Admin panel
2. ✅ User registrations will create user profiles
3. ✅ Cart and wishlist will persist across sessions
4. ✅ Orders will be stored permanently

---

## 🔄 Making Changes

To modify the schema later:

1. Create a new migration file (e.g., `002_add_column.sql`)
2. Write your ALTER TABLE statements
3. Run it through SQL Editor or CLI

Example:
```sql
ALTER TABLE products 
ADD COLUMN featured BOOLEAN DEFAULT false;
```

---

## 🎉 You're Ready!

Once the schema is deployed, your app will have full database persistence. All product, user, cart, and order data will be stored securely in Supabase!
