import { supabase } from './supabaseClient';

const STORAGE_BUCKET = 'product-images';

/**
 * Upload an image file to Supabase Storage
 * @param file - The image file to upload
 * @param path - Optional custom path within the bucket (defaults to auto-generated)
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(file: File, path?: string): Promise<string> {
  try {
    // Generate a unique filename if no path provided
    const filename = path || `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Delete an image from Supabase Storage
 * @param url - The public URL or path of the image to delete
 */
export async function deleteImage(url: string): Promise<void> {
  try {
    // Extract the path from the URL
    const path = url.split(`${STORAGE_BUCKET}/`)[1];
    if (!path) {
      console.warn('Could not extract path from URL:', url);
      return;
    }

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path]);

    if (error) {
      console.error('Storage delete error:', error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

/**
 * List all images in the storage bucket
 */
export async function listImages(): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list();

    if (error) {
      console.error('Storage list error:', error);
      throw new Error(`Failed to list images: ${error.message}`);
    }

    return data.map(file => {
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(file.name);
      return publicUrl;
    });
  } catch (error) {
    console.error('Error listing images:', error);
    throw error;
  }
}

/**
 * Get the public URL for an existing file in storage
 * @param path - The path to the file in the storage bucket
 */
export function getPublicUrl(path: string): string {
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);
  return publicUrl;
}
