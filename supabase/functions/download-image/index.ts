/**
 * Supabase Edge Function for Downloading Images from External URLs
 * This bypasses CORS issues by fetching images server-side
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();

    // Validate input
    if (!imageUrl || typeof imageUrl !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'imageUrl is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Convert Dropbox URLs to direct download format
    let downloadUrl = imageUrl;
    if (imageUrl.includes('dropbox.com')) {
      // Replace any dl= value with dl=1
      if (downloadUrl.includes('dl=')) {
        downloadUrl = downloadUrl.replace(/dl=\d+/g, 'dl=1');
      } else {
        downloadUrl += (downloadUrl.includes('?') ? '&' : '?') + 'dl=1';
      }
      
      // Add raw=1 for direct image serving
      if (!downloadUrl.includes('raw=1')) {
        downloadUrl += '&raw=1';
      }
    }

    console.log('Downloading image from:', downloadUrl);

    // Fetch the image server-side (no CORS restrictions)
    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ImageDownloader/1.0)',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch image:', response.status, response.statusText);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to fetch image: ${response.status} ${response.statusText}`,
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get the image as a blob
    const imageBlob = await response.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64 = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    // Determine content type
    const contentType = response.headers.get('content-type') || imageBlob.type || 'image/jpeg';

    // Return the image data as base64
    return new Response(
      JSON.stringify({
        success: true,
        data: base64,
        contentType: contentType,
        size: arrayBuffer.byteLength,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Download image Edge Function exception:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error during image download',
        details: error.stack,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

