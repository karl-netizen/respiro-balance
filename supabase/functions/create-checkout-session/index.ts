
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
    const { userId, tier } = await req.json()
    
    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Get user details
    const { data: user, error: userError } = await supabaseAdmin
      .from('user_profiles')
      .select('email')
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
    
    // Check if user already has a Stripe customer ID
    const { data: customers } = await stripe.customers.list({
      email: user.email,
      limit: 1,
    })
    
    let customerId: string
    if (customers && customers.data.length > 0) {
      customerId = customers.data[0].id
    } else {
      // Create a new customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId,
        },
      })
      customerId = customer.id
    }
    
    // Determine price ID based on tier
    let priceId: string
    if (tier === 'premium') {
      priceId = Deno.env.get('STRIPE_PREMIUM_PRICE_ID') ?? 'price_1NVnftLzO76QiexqU8H6gezL' // Default to a test price if not set
    } else if (tier === 'team') {
      priceId = Deno.env.get('STRIPE_TEAM_PRICE_ID') ?? 'price_1NVngGLzO76QiexqKxD9LOxU' // Default to a test price if not set
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid subscription tier' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Create a Checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/dashboard?subscription=success`,
      cancel_url: `${req.headers.get('origin')}/subscription?canceled=true`,
      metadata: {
        userId,
        tier,
      },
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

serve(handler)
