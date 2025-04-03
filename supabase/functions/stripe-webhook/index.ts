
// Follow this setup guide to integrate the Deno runtime and Stripe in your Supabase project:
// https://supabase.com/docs/guides/functions/integrations/stripe

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import Stripe from 'https://esm.sh/stripe@12.13.0?dts'

// This is the Stripe webhook handler for subscription events

const handler = async (req: Request) => {
  try {
    const stripeSignature = req.headers.get('stripe-signature')
    if (!stripeSignature) {
      return new Response('Webhook signature missing', { status: 400 })
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    })
    
    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the raw request body
    const body = await req.text()
    
    // Verify the webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        stripeSignature,
        Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET') ?? ''
      )
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed.`, err.message)
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 })
    }

    // Handle specific webhook events
    switch (event.type) {
      // New subscription created
      case 'checkout.session.completed': {
        const checkoutSession = event.data.object
        
        // Get user ID from session metadata
        const userId = checkoutSession.metadata?.userId
        if (!userId) {
          console.error('No user ID in session metadata')
          return new Response('No user ID in session metadata', { status: 400 })
        }
        
        const customerId = checkoutSession.customer
        const subscriptionId = checkoutSession.subscription
        const tier = checkoutSession.metadata?.tier || 'premium'
        
        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        
        // Update user profile with subscription details
        await supabaseAdmin
          .from('user_profiles')
          .update({
            subscription_tier: tier,
            subscription_status: subscription.status,
            subscription_id: customerId,
            subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            // Premium users get unlimited meditation minutes
            meditation_minutes_limit: 999999
          })
          .eq('id', userId)
        
        break
      }
      
      // Subscription updated
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const status = subscription.status
        const customerId = subscription.customer
        
        // Find user with this customer ID
        const { data: user } = await supabaseAdmin
          .from('user_profiles')
          .select('id')
          .eq('subscription_id', customerId)
          .single()
        
        if (user) {
          // Update subscription details
          await supabaseAdmin
            .from('user_profiles')
            .update({
              subscription_status: status,
              subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString()
            })
            .eq('id', user.id)
        }
        
        break
      }
      
      // Subscription canceled or expired
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const customerId = subscription.customer
        
        // Find user with this customer ID
        const { data: user } = await supabaseAdmin
          .from('user_profiles')
          .select('id')
          .eq('subscription_id', customerId)
          .single()
        
        if (user) {
          // Downgrade to free tier
          await supabaseAdmin
            .from('user_profiles')
            .update({
              subscription_tier: 'free',
              subscription_status: 'canceled',
              subscription_period_end: null,
              meditation_minutes_limit: 60
            })
            .eq('id', user.id)
        }
        
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Webhook error:', error.message)
    return new Response(`Webhook Error: ${error.message}`, { status: 400 })
  }
}

serve(handler)
