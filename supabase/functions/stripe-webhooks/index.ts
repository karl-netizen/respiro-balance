
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

const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (request) => {
  const signature = request.headers.get('Stripe-Signature');
  const body = await request.text();
  
  if (!signature) {
    return new Response('Missing stripe signature', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET') || '',
      undefined,
      cryptoProvider
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  console.log('Processing webhook event:', event.type);

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      case 'customer.created':
        await handleCustomerCreated(event.data.object as Stripe.Customer);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response('Webhook processing failed', { status: 500 });
  }
});

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  
  // Get price to determine tier
  const priceId = subscription.items.data[0]?.price.id;
  let tier = 'premium';
  
  // Map price IDs to tiers (you'll need to configure these)
  const priceToTierMap: Record<string, string> = {
    // Add your actual Stripe price IDs here
    'price_premium': 'premium',
    'price_premium_pro': 'premium-pro',
    'price_premium_plus': 'premium-plus',
  };
  
  tier = priceToTierMap[priceId] || 'premium';
  
  // Update user subscription
  const { error } = await supabase
    .from('user_profiles')
    .update({
      subscription_tier: tier,
      subscription_status: subscription.status,
      subscription_id: subscriptionId,
      subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('id', (await getUserIdFromCustomerId(customerId)));

  if (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }

  // Send confirmation email
  await sendSubscriptionEmail(customerId, 'subscription_updated', {
    tier,
    status: subscription.status,
    period_end: new Date(subscription.current_period_end * 1000).toLocaleDateString(),
  });
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const userId = await getUserIdFromCustomerId(customerId);
  
  // Update to free tier
  const { error } = await supabase
    .from('user_profiles')
    .update({
      subscription_tier: 'free',
      subscription_status: 'cancelled',
      subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }

  // Send cancellation email
  await sendSubscriptionEmail(customerId, 'subscription_cancelled', {
    access_until: new Date(subscription.current_period_end * 1000).toLocaleDateString(),
  });
}

async function handlePaymentSuccess(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  // Send payment success email
  await sendSubscriptionEmail(customerId, 'payment_success', {
    amount: (invoice.amount_paid / 100).toFixed(2),
    currency: invoice.currency.toUpperCase(),
    invoice_url: invoice.hosted_invoice_url,
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  // Send payment failed email
  await sendSubscriptionEmail(customerId, 'payment_failed', {
    amount: (invoice.amount_due / 100).toFixed(2),
    currency: invoice.currency.toUpperCase(),
    next_retry: invoice.next_payment_attempt ? 
      new Date(invoice.next_payment_attempt * 1000).toLocaleDateString() : 'N/A',
  });
}

async function handleCustomerCreated(customer: Stripe.Customer) {
  // Update customer ID in database
  if (customer.email) {
    const { error } = await supabase
      .from('subscribers')
      .upsert({
        email: customer.email,
        stripe_customer_id: customer.id,
      }, { onConflict: 'email' });

    if (error) {
      console.error('Error updating customer:', error);
    }
  }
}

async function getUserIdFromCustomerId(customerId: string): Promise<string> {
  const { data } = await supabase
    .from('subscribers')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();
  
  return data?.user_id;
}

async function sendSubscriptionEmail(customerId: string, template: string, variables: Record<string, any>) {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    
    if ('email' in customer && customer.email) {
      const userId = await getUserIdFromCustomerId(customerId);
      
      // Call send-email function
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: customer.email,
          template,
          variables,
          userId,
        }),
      });
    }
  } catch (error) {
    console.error('Error sending subscription email:', error);
  }
}
