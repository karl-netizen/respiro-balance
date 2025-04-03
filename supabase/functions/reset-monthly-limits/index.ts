
// This scheduled function resets the meditation minutes for free users on the 1st of each month
// It should be scheduled to run on the 1st of each month at 00:00 UTC

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const handler = async (_req: Request) => {
  try {
    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Reset meditation minutes for free users
    const { error } = await supabaseAdmin.rpc('reset_monthly_meditation_limits')

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Monthly meditation limits reset successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error resetting meditation limits:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

serve(handler)
