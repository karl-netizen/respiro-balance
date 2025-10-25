/**
 * Admin Check Edge Function
 *
 * SERVER-SIDE role validation to prevent privilege escalation
 * DO NOT rely on client-side app_metadata checks!
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdminCheckRequest {
  operation: string;
  requiredRole?: 'admin' | 'moderator' | 'super_admin';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role for privileged operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the user's JWT
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body: AdminCheckRequest = await req.json();
    const requiredRole = body.requiredRole || 'admin';

    // SERVER-SIDE role check using user_roles table
    const { data: roles, error: roleError } = await supabase
      .from('user_roles')
      .select('role, granted_at, revoked_at')
      .eq('user_id', user.id)
      .is('revoked_at', null);

    if (roleError) {
      console.error('Error fetching user roles:', roleError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify permissions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has required role
    const hasRequiredRole = roles?.some(r => {
      if (requiredRole === 'super_admin') {
        return r.role === 'super_admin';
      }
      if (requiredRole === 'admin') {
        return r.role === 'admin' || r.role === 'super_admin';
      }
      if (requiredRole === 'moderator') {
        return r.role === 'moderator' || r.role === 'admin' || r.role === 'super_admin';
      }
      return false;
    });

    if (!hasRequiredRole) {
      // Log unauthorized access attempt
      console.warn(`Unauthorized admin access attempt: user=${user.id}, operation=${body.operation}`);

      return new Response(
        JSON.stringify({
          authorized: false,
          error: 'Insufficient permissions',
          requiredRole,
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Success - user is authorized
    return new Response(
      JSON.stringify({
        authorized: true,
        userId: user.id,
        userEmail: user.email,
        roles: roles.map(r => r.role),
        operation: body.operation,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Admin check error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
