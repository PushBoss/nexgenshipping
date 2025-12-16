# Fix for Dropbox Image Upload CORS Issue

## Problem
When bulk uploading products with Dropbox image URLs, the browser blocks the image fetch due to CORS (Cross-Origin Resource Sharing) restrictions. Dropbox doesn't allow direct image fetching from browser JavaScript.

## Solution
A Supabase Edge Function (`download-image`) has been created to proxy image downloads server-side, bypassing CORS restrictions.

## Deployment Steps

### 1. Deploy the Edge Function

```bash
# Navigate to project root
cd /Users/aarongardiner/Desktop/nexgenshipping-main

# Deploy the download-image Edge Function
supabase functions deploy download-image
```

### 2. Verify Deployment

The Edge Function should be accessible at:
```
https://erxkwytqautexizleeov.supabase.co/functions/v1/download-image
```

### 3. Test the Fix

1. Go to Admin Dashboard → Bulk Upload
2. Upload a CSV with Dropbox image URLs
3. The images should now upload successfully without CORS errors

## How It Works

1. **Client-side**: When `uploadImageToStorage` encounters an external image URL (especially Dropbox), it calls the Edge Function instead of fetching directly.

2. **Edge Function**: The `download-image` function:
   - Receives the image URL
   - Converts Dropbox URLs to direct download format (`dl=1&raw=1`)
   - Fetches the image server-side (no CORS restrictions)
   - Returns the image as base64

3. **Client-side**: The client:
   - Receives the base64 image data
   - Converts it to a Blob
   - Uploads to Supabase Storage
   - Returns the public Supabase Storage URL

## Fallback Behavior

If the Edge Function fails or is unavailable, the code falls back to direct fetch (which may still fail for Dropbox due to CORS, but works for other image sources).

## Supported Image Sources

✅ **Dropbox** - Uses Edge Function (bypasses CORS)  
✅ **Other HTTP URLs** - Uses Edge Function first, falls back to direct fetch  
✅ **Data URLs** - Direct upload (no Edge Function needed)  
✅ **Supabase Storage URLs** - Skipped (already uploaded)

## Troubleshooting

### Edge Function Not Deployed
**Error**: `Failed to fetch` or `404 Not Found`  
**Solution**: Deploy the Edge Function using the command above

### Edge Function Returns Error
**Error**: `Failed to fetch image: 403 Forbidden`  
**Solution**: 
- Check if the Dropbox link is publicly accessible
- Verify the Dropbox URL format is correct
- Check Edge Function logs in Supabase Dashboard

### Images Still Not Uploading
**Error**: Images fail to upload even after Edge Function succeeds  
**Solution**:
- Check Supabase Storage bucket permissions
- Verify `product-images` bucket exists
- Check browser console for specific error messages

## Edge Function Code Location

The Edge Function code is located at:
```
supabase/functions/download-image/index.ts
```

## Testing

To test the Edge Function manually:

```bash
curl -X POST https://erxkwytqautexizleeov.supabase.co/functions/v1/download-image \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"imageUrl": "https://www.dropbox.com/scl/fi/...your-dropbox-url...?dl=0"}'
```

Expected response:
```json
{
  "success": true,
  "data": "base64_encoded_image_data...",
  "contentType": "image/jpeg",
  "size": 123456
}
```

## Status

- ✅ Edge Function created
- ✅ Client code updated to use Edge Function
- ⏳ **Needs deployment** - Run `supabase functions deploy download-image`
- ⏳ **Needs testing** - Test with actual Dropbox URLs

