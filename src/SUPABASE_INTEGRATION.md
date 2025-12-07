# Nex-Gen Shipping - Supabase Backend Integration Guide

## Overview

Your Nex-Gen Shipping e-commerce site now has **full Supabase backend integration** for persistent data storage. This means all your products, user data, cart, orders, and wishlist information can be stored in a real database instead of just browser local storage.

## What's Been Added

### 1. **Supabase Backend Server** (`/supabase/functions/server/index.tsx`)
   - **Products API**: Create, read, update, delete products
   - **Bulk Operations**: Bulk import and bulk delete (by category or purge all)
   - **User Data API**: Store cart, wishlist, orders, and account settings per user

### 2. **API Helper Functions** (`/utils/api.ts`)
   - `productsApi.getAll()` - Fetch all products
   - `productsApi.create(product)` - Add a new product
   - `productsApi.update(id, updates)` - Update a product
   - `productsApi.delete(id)` - Delete a product
   - `productsApi.bulkImport(products)` - Import multiple products at once
   - `productsApi.bulkDelete(action)` - Delete by category ('baby', 'pharmaceutical') or 'purge' all
   - `userApi.get(email)` - Get user data
   - `userApi.update(email, userData)` - Update user data

### 3. **React Hook for Products** (`/hooks/useProducts.ts`)
   - Automatic loading from Supabase on mount
   - Graceful fallback to local state if API fails
   - All CRUD operations integrated with backend
   - Bulk import and delete support

### 4. **Enhanced Admin Features**

#### **Improved CSV Bulk Upload**
   - ✅ **Handles embedded images in cells**
   - ✅ Supports quoted fields with commas
   - ✅ Proper CSV parsing for complex formats
   - ✅ Preview before import with analytics (cost, stock, sold, profit)
   - ✅ Error validation and reporting
   - ✅ Template download

#### **New Bulk Delete Feature**
   - ✅ Delete all Baby Products
   - ✅ Delete all Pharmaceutical Products
   - ✅ Purge All (delete everything)
   - ✅ Confirmation dialogs with product counts
   - ✅ Visual warnings for dangerous operations

## How to Use

### Current State: **Prototype Mode**

The site is currently configured to work **without requiring Supabase setup**. All data is stored locally in the browser.

### Enable Supabase Backend (Optional)

To enable persistent cloud storage:

1. **Configure Supabase** (if not already done):
   - Your Supabase project is already connected
   - Backend endpoints are configured at `/supabase/functions/server/index.tsx`

2. **Toggle Supabase Mode**:
   - Open `/utils/config.ts`
   - Set `useSupabase: true` (it's already set to true by default)
   - The app will automatically use the backend

3. **Verify Connection**:
   - The admin dashboard will automatically sync with Supabase
   - Products you add will persist across sessions
   - Multiple users can see the same data

### Data Storage

#### With Supabase Enabled:
- Products stored in: `kv_store` table with prefix `product:`
- User data stored in: `kv_store` table with prefix `user:{email}`
- Persists across browser sessions and devices
- Supports multiple concurrent users

#### Without Supabase (Local Mode):
- Products stored in: React state only
- Resets when page is refreshed
- Good for demos and prototyping

## Admin Features Guide

### Bulk Upload CSV

1. **Download Template**:
   - Go to Admin Dashboard → Bulk Upload tab
   - Click "Download CSV Template"

2. **Prepare Your CSV**:
   ```csv
   name,description,category,categoryId,price,costPrice,stockCount,soldCount,rating,reviewCount,image,inStock,badge
   "Baby Onesie","Soft cotton onesie",baby,baby-clothing-accessories,12.99,6.50,150,87,4.5,150,https://...,true,Best Seller
   ```

3. **CSV Format Notes**:
   - **Supports images embedded in cells** - the parser handles quoted fields
   - Required: name, category, categoryId, price
   - Optional: description, costPrice, stockCount, soldCount, rating, reviewCount, image, inStock, badge
   - Categories: `baby` or `pharmaceutical`
   - Valid badges: `Best Seller`, `Top Rated`, `New`

4. **Upload & Import**:
   - Choose your CSV file
   - Review the preview with analytics
   - Click "Import Products"
   - Products are saved to Supabase (if enabled)

### Bulk Delete

1. **Access Bulk Delete Tab**:
   - Admin Dashboard → Bulk Delete tab

2. **Three Delete Options**:

   **Option 1: Delete Baby Products**
   - Removes all baby category products
   - Shows count before deletion
   - Confirmation required

   **Option 2: Delete Pharmaceuticals**
   - Removes all pharmaceutical products
   - Shows count before deletion
   - Confirmation required

   **Option 3: Purge All (Danger Zone)**
   - Deletes ALL products from both categories
   - ⚠️ **Cannot be undone**
   - Bright red warning
   - Double confirmation

3. **Safety Features**:
   - Visual count of products to be deleted
   - Confirmation dialog with details
   - Disabled buttons when no products exist
   - Color-coded by severity (blue → red → danger red)

## API Endpoints Reference

All endpoints are prefixed with: `/make-server-2ab21562`

### Products
- `GET /products` - Get all products
- `POST /products` - Create a product
- `PUT /products/:id` - Update a product
- `DELETE /products/:id` - Delete a product
- `POST /products/bulk` - Bulk import products
- `DELETE /products/bulk/:action` - Bulk delete (action: baby | pharmaceutical | purge)

### Users
- `GET /users/:email` - Get user data (cart, wishlist, orders, settings)
- `PUT /users/:email` - Update user data

## Technical Details

### Backend Stack
- **Runtime**: Deno (Supabase Edge Functions)
- **Framework**: Hono (lightweight web framework)
- **Storage**: Supabase KV Store (key-value database)
- **CORS**: Enabled for all origins

### Frontend Integration
- **State Management**: React hooks
- **API Calls**: Fetch API with error handling
- **Fallback Strategy**: Local state if API fails
- **Loading States**: Loading indicators during API calls

### Error Handling
- All API calls wrapped in try-catch
- Console logging for debugging
- Graceful fallback to local state
- User-friendly error messages via toast notifications

## Best Practices

### For Development
1. Keep `useSupabase: false` in `/utils/config.ts` for quick prototyping
2. Enable Supabase when you need persistent data
3. Check browser console for API errors

### For Production
1. Set `useSupabase: true` for real deployments
2. Monitor backend logs in Supabase dashboard
3. Regular backups of product data (use bulk export if needed)

### Data Management
1. **Regular Backups**: Download your product data as CSV periodically
2. **Test Bulk Deletes**: Always verify the count before confirming
3. **Purge Carefully**: The purge operation is permanent

## Migration Path

### From Local to Supabase:
1. Export current products (if needed)
2. Set `useSupabase: true` in config
3. Use bulk upload to import existing data
4. Verify all products loaded correctly

### From Supabase to Local:
1. Download products as CSV
2. Set `useSupabase: false` in config
3. App will use initial MOCK_PRODUCTS

## Troubleshooting

### Products not loading?
- Check browser console for errors
- Verify Supabase connection in Network tab
- Fallback to local state is automatic

### Bulk upload failing?
- Check CSV format (use template)
- Verify all required fields present
- Look for parsing errors in preview

### Bulk delete not working?
- Ensure products exist in selected category
- Check console for API errors
- Verify Supabase backend is running

## Future Enhancements

Potential additions:
- Export products to CSV from admin panel
- Product search and filtering in bulk operations
- Undo functionality for accidental deletes
- Product versioning/history
- Multi-user authentication with Supabase Auth
- Real-time updates across multiple admin sessions

## Support

For issues or questions:
1. Check browser console for error messages
2. Review Supabase function logs
3. Verify data in Supabase dashboard KV store
4. Test with `useSupabase: false` to isolate backend issues

---

**Current Status**: ✅ Backend integrated, enhanced CSV parser, bulk delete feature added
**Supabase Mode**: Configurable via `/utils/config.ts`
**Fallback**: Automatic fallback to local state if backend unavailable
