
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import Stripe from 'https://esm.sh/stripe@12.13.0?dts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const handler = async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()
    
    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Get user details
    const { data: user, error: userError } = await supabaseAdmin
      .from('user_profiles')
      .select('email, subscription_id')
      .eq('id', userId)
      .single()
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    })
    
    // Check if user has a subscription
    if (!user.subscription_id) {
      return new Response(
        JSON.stringify({ 
          subscribed: false,
          tier: 'free',
          status: 'inactive',
          period_end: null
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Get customer data from Stripe
    const customer = await stripe.customers.retrieve(user.subscription_id)
    if (customer.deleted) {
      // Update user profile to remove subscription
      await supabaseAdmin
        .from('user_profiles')
        .update({
          subscription_tier: 'free',
          subscription_status: 'canceled',
          subscription_period_end: null,
          meditation_minutes_limit: 60
        })
        .eq('id', userId)

      return new Response(
        JSON.stringify({ 
          subscribed: false,
          tier: 'free',
          status: 'canceled',
          period_end: null
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Get customer's subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: user.subscription_id,
      status: 'active',
      limit: 1,
    })
    
    if (subscriptions.data.length === 0) {
      // No active subscriptions found
      await supabaseAdmin
        .from('user_profiles')
        .update({
          subscription_tier: 'free',
          subscription_status: 'inactive',
          subscription_period_end: null,
          meditation_minutes_limit: 60
        })
        .eq('id', userId)

      return new Response(
        JSON.stringify({ 
          subscribed: false,
          tier: 'free',
          status: 'inactive',
          period_end: null
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Active subscription found
    const subscription = subscriptions.data[0]
    const periodEnd = new Date(subscription.current_period_end * 1000).toISOString()
    
    // Determine tier based on price
    const priceId = subscription.items.data[0].price.id
    const price = await stripe.prices.retrieve(priceId)
    
    let tier = 'premium'
    // Assuming team tier is more expensive
    if (price.unit_amount && price.unit_amount >= 4900) {
      tier = 'team'
    }
    
    // Update user profile with latest subscription info
    await supabaseAdmin
      .from('user_profiles')
      .update({
        subscription_tier: tier,
        subscription_status: subscription.status,
        subscription_period_end: periodEnd,
        meditation_minutes_limit: 999999 // Unlimited for paid tiers
      })
      .eq('id', userId)

    return new Response(
      JSON.stringify({ 
        subscribed: true,
        tier,
        status: subscription.status,
        period_end: periodEnd
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error checking subscription status:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

serve(handler)
