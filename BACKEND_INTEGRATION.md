# Backend Integration Guide - NEX-GEN Shipping

## Overview
Your app is now fully integrated with Supabase backend! Products are automatically saved to the database when added through the Admin Panel.

## ✅ What's Been Set Up

### 1. Database Schema
- **Location**: `supabase/migrations/001_initial_schema.sql`
- **Tables Created**:
  - `products` - Product catalog with full details
  - `categories` - Product categories (baby, pharmaceutical, etc.)
  - `orders` - Customer orders
  - `order_items` - Items in each order
  - `user_profiles` - Extended user information
  - `user_addresses` - Shipping/billing addresses
  - `cart_items` - Shopping cart
  - `wishlist_items` - User wishlists
  - `product_reviews` - Customer reviews
  - `inventory_transactions` - Stock tracking

### 2. Automatic Backend Sync
All product operations now sync with Supabase:
- ✅ **Adding products** - Saved to database immediately
- ✅ **Updating products** - Changes synced to database
- ✅ **Deleting products** - Removed from database
- ✅ **Loading products** - Fetched from database on app start

### 3. Smart Fallback System
If Supabase is unavailable:
- App continues working with local state
- User gets a notification about offline mode
- Data is kept in memory until backend is available

## 🚀 Deployment Steps

### Step 1: Deploy Database Schema

Choose one of these methods:

#### Option A: Using Supabase Dashboard (Easiest)
1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
5. Paste and click **Run**
6. Wait for confirmation (should take 10-30 seconds)

#### Option B: Using Deployment Script
```bash
cd /Users/aarongardiner/Desktop/nexgenshipping-main
./supabase/deploy.sh
```
Follow the prompts to deploy to your project.

#### Option C: Using Supabase CLI
```bash
# If not installed:
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref erxkwytqautexizleeov

# Push migration
supabase db push
```

### Step 2: Verify Connection

1. Start your app:
```bash
npm run dev
```

2. Open browser console (F12)
3. Look for: `✅ Loaded X products from Supabase`

### Step 3: Add Your First Product

1. Login as admin (use admin credentials)
2. Go to Admin Dashboard
3. Click "Add Product"
4. Fill in product details
5. Click Save
6. Check console for: `✅ Product created in Supabase`

### Step 4: Verify in Supabase

1. Go to Supabase Dashboard
2. Navigate to **Table Editor**
3. Select `products` table
4. You should see your newly added product!

## 📝 Configuration

### Enable/Disable Supabase

Edit `src/utils/config.ts`:

```typescript
export const config = {
  useSupabase: true,  // Set to false for local-only mode
  debugMode: true,    // Set to true to see detailed logs
};
```

### Debug Mode

When `debugMode: true`, you'll see detailed logs:
- Product creation events
- Backend sync status
- Error details
- API call information

## 🔧 Features

### Automatic Product Sync
```typescript
// When admin adds a product:
handleAddProduct(newProduct)
  ↓
productsService.create(newProduct)
  ↓
✅ Saved to Supabase
  ↓
✅ Added to local state
  ↓
✅ UI updates immediately
```

### Error Handling
If backend fails:
```typescript
try {
  await productsService.create(product);
  toast.success('Product added!');
} catch (error) {
  // Fallback to local state
  toast.warning('Added locally (backend offline)');
}
```

### Loading Products
On app startup:
```typescript
1. App loads mock products initially
2. Fetches from Supabase in background
3. Replaces mock data with real data
4. User sees smooth transition
```

## 📊 Data Flow

### Adding a Product
```
Admin Panel
    ↓
handleAddProduct()
    ↓
productsService.create()
    ↓
Supabase API
    ↓
Database INSERT
    ↓
Return new product with ID
    ↓
Update local state
    ↓
UI refreshes
```

### Loading Products
```
App Start
    ↓
useEffect()
    ↓
productsService.getAll()
    ↓
Supabase API
    ↓
Database SELECT
    ↓
Map to Product interface
    ↓
setProducts()
    ↓
UI displays products
```

## 🔍 Testing

### Test Product Creation
1. Open Admin Panel
2. Add a test product
3. Check browser console for success message
4. Verify in Supabase dashboard
5. Refresh page - product should still be there!

### Test Product Update
1. Edit an existing product
2. Save changes
3. Check console for update confirmation
4. Refresh page - changes should persist

### Test Product Deletion
1. Delete a product
2. Check console for delete confirmation
3. Verify it's removed from Supabase
4. Refresh page - product should stay gone

## 🐛 Troubleshooting

### "Failed to load products from Supabase"
- **Check**: Is Supabase project running?
- **Check**: Is the schema deployed?
- **Check**: Is `config.useSupabase = true`?
- **Fix**: Deploy schema using steps above

### "Product added locally (backend sync failed)"
- **Check**: Internet connection
- **Check**: Supabase project status
- **Check**: Browser console for detailed error
- **Fix**: Products will sync when backend is back online

### Products don't persist after refresh
- **Check**: Is Supabase integration enabled?
- **Check**: Was schema deployed successfully?
- **Check**: Are products being created in Supabase? (check dashboard)

### TypeScript errors
- **Fix**: Run `npm install` to ensure all dependencies are installed
- **Check**: TypeScript types in `src/types/database.types.ts`

## 📚 File Reference

| File | Purpose |
|------|---------|
| `supabase/migrations/001_initial_schema.sql` | Complete database schema |
| `src/utils/supabaseClient.ts` | Supabase connection client |
| `src/utils/productsService.ts` | Product CRUD operations |
| `src/utils/config.ts` | Enable/disable Supabase |
| `src/types/database.types.ts` | TypeScript database types |
| `src/App.tsx` | Integration with React app |
| `supabase/SCHEMA_README.md` | Database documentation |

## 🎯 Next Steps

1. **Deploy the schema** (see Step 1 above)
2. **Test adding products** through Admin Panel
3. **Verify data persistence** by refreshing the page
4. **Create admin user** in Supabase
5. **Set up product images** storage bucket (optional)

## 💡 Tips

- Always check browser console for sync status
- Use debug mode during development
- Products are cached locally for performance
- Backend errors don't break the app - it falls back gracefully
- Check Supabase dashboard to verify data

## 🆘 Need Help?

- Check browser console for detailed errors
- Verify Supabase project status at https://app.supabase.com
- Review `supabase/SCHEMA_README.md` for database details
- Ensure all dependencies are installed: `npm install`

---

**Status**: ✅ Backend integration complete and ready to use!
