# Supabase Storage Setup Guide

## Overview
Your app now has Supabase Storage configured for product images with proper security policies.

## What Was Configured

### 1. Storage Utilities (`src/utils/storage.ts`)
- `uploadImage(file, path?)` - Upload image files to Supabase Storage
- `deleteImage(url)` - Remove images from storage
- `listImages()` - List all stored images
- `getPublicUrl(path)` - Get public URL for a file

### 2. Middleware (`src/utils/middleware.ts`)
Security and error handling middleware:
- **Error Handling**: `SupabaseError` class for consistent error messages
- **Authentication**: `requireAuth()` to protect routes
- **Rate Limiting**: Client-side rate limiting to prevent abuse
- **Retry Logic**: `withRetry()` for transient failures
- **Input Validation**: `sanitizeInput()` and `validateFileUpload()`

### 3. Database Migration (`002_storage_setup.sql`)
Storage bucket policies:
- ✅ Public read access (anyone can view images)
- ✅ Authenticated upload (only logged-in users can upload)
- ✅ Owner-only update/delete (users can only modify their own uploads)

### 4. Client Configuration
Updated `supabaseClient.ts` with storage support enabled.

## Setup Instructions

### Step 1: Deploy Storage Migration
```bash
cd supabase
supabase db push
```

Or manually run in Supabase SQL Editor:
```sql
-- Copy contents of migrations/002_storage_setup.sql
```

### Step 2: Verify Storage Bucket
1. Go to Supabase Dashboard → Storage
2. Verify `product-images` bucket exists
3. Check that "Public bucket" is enabled

### Step 3: Configure Storage in Dashboard
1. **Navigate to**: Project Settings → Storage
2. **File size limit**: Set max upload size (default: 50MB)
3. **Allowed MIME types**: Ensure these are allowed:
   - image/jpeg
   - image/png
   - image/webp
   - image/gif

### Step 4: Update AdminPage to Use Storage
Replace file input handling in `AdminPage.tsx`:

```typescript
import { uploadImage, deleteImage } from '../utils/storage';
import { validateFileUpload } from '../utils/middleware';

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    // Validate file
    validateFileUpload(file);
    
    // Upload to Supabase Storage
    toast.info('Uploading image...');
    const publicUrl = await uploadImage(file);
    
    // Update product with storage URL
    if (isEdit && editingProduct) {
      setEditingProduct({ ...editingProduct, image: publicUrl });
    } else {
      setNewProduct({ ...newProduct, image: publicUrl });
    }
    
    toast.success('Image uploaded successfully!');
  } catch (error) {
    console.error('Upload error:', error);
    toast.error(error.message || 'Failed to upload image');
  }
};
```

## Usage Examples

### Upload Image
```typescript
import { uploadImage } from './utils/storage';

const file = event.target.files[0];
const url = await uploadImage(file);
console.log('Image URL:', url);
```

### Delete Image
```typescript
import { deleteImage } from './utils/storage';

await deleteImage('https://...supabase.co/storage/.../image.jpg');
```

### With Error Handling
```typescript
import { withRetry } from './utils/middleware';

const url = await withRetry(() => uploadImage(file));
```

## Security Features

### Rate Limiting
```typescript
import { checkRateLimit } from './utils/middleware';

checkRateLimit('upload-images', 10, 60000); // 10 uploads per minute
```

### Input Validation
```typescript
import { validateFileUpload } from './utils/middleware';

validateFileUpload(file, 5 * 1024 * 1024); // Max 5MB
```

### Auth Protection
```typescript
import { requireAuth } from './utils/middleware';

const userId = await requireAuth(); // Throws if not logged in
```

## Storage Policies

| Action | Who Can Perform | Condition |
|--------|----------------|-----------|
| View | Anyone | Public bucket |
| Upload | Authenticated users | Must be logged in |
| Update | File owner | User owns the file |
| Delete | File owner | User owns the file |

## Troubleshooting

### "Storage API not available"
- Verify Storage is enabled in Supabase Dashboard
- Check that `product-images` bucket exists
- Ensure migration was deployed successfully

### Upload fails with 401
- User must be authenticated
- Check `auth.getSession()` returns valid session
- Verify RLS policies are correctly set

### Images not loading
- Confirm bucket is set to public
- Check URL format: `https://[project].supabase.co/storage/v1/object/public/product-images/[filename]`
- Verify CORS settings allow your domain

### File size too large
- Check Storage settings in Supabase Dashboard
- Default limit is 50MB
- Adjust in Project Settings → Storage → File size limit

## Next Steps

1. ✅ Deploy storage migration
2. ✅ Verify bucket creation in dashboard
3. ⏳ Update AdminPage image upload logic
4. ⏳ Test upload/delete functionality
5. ⏳ Implement image optimization (optional)
6. ⏳ Add progress indicators for uploads

## Related Files
- `src/utils/storage.ts` - Storage operations
- `src/utils/middleware.ts` - Security middleware
- `src/utils/supabaseClient.ts` - Client configuration
- `supabase/migrations/002_storage_setup.sql` - Database setup
