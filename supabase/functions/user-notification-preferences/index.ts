// @ts-nocheck - Supabase Edge Function (Deno runtime)
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');

    if (!supabaseUrl || !serviceRoleKey || !token) {
      throw new Error('Missing credentials');
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'GET') {
      const { data, error } = await supabaseAdmin
        .from('user_notification_preferences')
        .select('order_updates, promotions, newsletter, sms_alerts')
        .eq('user_id', authData.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return new Response(JSON.stringify({
        preferences: data || {
          order_updates: true,
          promotions: true,
          newsletter: false,
          sms_alerts: false,
        },
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'PUT') {
      const payload = await req.json();
      const { data, error } = await supabaseAdmin
        .from('user_notification_preferences')
        .upsert({
          user_id: authData.user.id,
          order_updates: !!payload.order_updates,
          promotions: !!payload.promotions,
          newsletter: !!payload.newsletter,
          sms_alerts: !!payload.sms_alerts,
          updated_at: new Date().toISOString(),
        })
        .select('order_updates, promotions, newsletter, sms_alerts')
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ preferences: data }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('User notification preferences error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to manage notification preferences' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
