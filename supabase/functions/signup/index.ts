import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, fullName } = await req.json();

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Attempt to sign up the user
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
        },
        emailRedirectTo: `${req.headers.get('origin')}/dashboard`
      }
    });

    if (error) {
      throw error;
    }

    // If user is created successfully
    if (data.user) {
      // Create user profile using service role
      const supabaseService = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      // Insert user profile
      const { error: profileError } = await supabaseService
        .from('user_profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName || '',
          subscription_tier: 'free',
          subscription_status: 'active'
        });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // Don't fail the signup if profile creation fails
      }

      // Insert default user preferences
      const { error: preferencesError } = await supabaseService
        .from('user_preferences')
        .insert({
          user_id: data.user.id,
          has_completed_onboarding: false
        });

      if (preferencesError) {
        console.error('Error creating user preferences:', preferencesError);
        // Don't fail the signup if preferences creation fails
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: data.user,
        session: data.session,
        message: data.user?.email_confirmed_at 
          ? 'Account created successfully!' 
          : 'Please check your email to confirm your account.'
      }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error('Error in signup:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  }
})