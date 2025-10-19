
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckoutRequest {
  priceId: string;
  userId: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
  tier: string;
  billingPeriod: 'monthly' | 'yearly';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { priceId, userId, email, successUrl, cancelUrl, tier, billingPeriod }: CheckoutRequest = await req.json();

    console.log('Creating checkout session for:', { priceId, tier, billingPeriod, email });

    // Get or create customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email,
        metadata: { userId }
      });
      customerId = customer.id;
    }

    // Update subscribers table
    const { error: upsertError } = await supabase
      .from('subscribers')
      .upsert({
        user_id: userId,
        email,
        stripe_customer_id: customerId,
        subscription_tier: tier,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });

    if (upsertError) {
      console.error('Error upserting subscriber:', upsertError);
    }

    // Create price based on tier and billing period
    let unitAmount;
    switch (tier) {
      case 'premium':
        unitAmount = billingPeriod === 'yearly' ? 797 : 1197; // $7.97 or $11.97
        break;
      case 'premium_pro':
        unitAmount = billingPeriod === 'yearly' ? 2997 : 2997; // $29.97 or $29.97
        break;
      case 'premium_plus':
        unitAmount = billingPeriod === 'yearly' ? 4797 : 4797; // $47.97 or $47.97
        break;
      default:
        throw new Error('Invalid subscription tier');
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Respiro Balance ${tier.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
              description: `${tier.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} subscription`,
            },
            unit_amount: unitAmount,
            recurring: {
              interval: billingPeriod === 'yearly' ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        tier,
        billingPeriod,
      },
      subscription_data: {
        metadata: {
          userId,
          tier,
          billingPeriod,
        },
      },
    });

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Checkout session creation error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
