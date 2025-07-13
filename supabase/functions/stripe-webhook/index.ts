
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET");
    
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SIGNING_SECRET is not set");
    
    logStep("Environment variables verified");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    const signature = req.headers.get("stripe-signature");
    if (!signature) throw new Error("No Stripe signature found");

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      logStep("Webhook signature verified", { eventType: event.type });
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err });
      throw new Error(`Webhook signature verification failed: ${err}`);
    }

    // Initialize Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(supabaseClient, stripe, session);
        break;
      }
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(supabaseClient, stripe, subscription, event.type);
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancellation(supabaseClient, stripe, subscription);
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleSuccessfulPayment(supabaseClient, stripe, invoice);
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleFailedPayment(supabaseClient, stripe, invoice);
        break;
      }
      
      default:
        logStep("Unhandled event type", { eventType: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in stripe-webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

async function handleCheckoutCompleted(
  supabaseClient: any,
  stripe: Stripe,
  session: Stripe.Checkout.Session
) {
  logStep("Handling checkout completed", { sessionId: session.id });

  const userId = session.metadata?.user_id;
  const tier = session.metadata?.subscription_tier || 'premium';
  
  if (!userId) {
    throw new Error("No user ID in session metadata");
  }

  const customer = await stripe.customers.retrieve(session.customer as string);
  const email = (customer as Stripe.Customer).email;

  if (session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    await handleSubscriptionChange(supabaseClient, stripe, subscription, 'checkout_completed');
  }

  logStep("Checkout completed successfully", { userId, tier, email });
}

async function handleSubscriptionChange(
  supabaseClient: any,
  stripe: Stripe,
  subscription: Stripe.Subscription,
  eventType: string
) {
  logStep("Handling subscription change", { subscriptionId: subscription.id, eventType });

  const customer = await stripe.customers.retrieve(subscription.customer as string);
  if (!customer || customer.deleted) {
    throw new Error("Customer not found or deleted");
  }

  const email = (customer as Stripe.Customer).email;
  if (!email) {
    throw new Error("Customer email not found");
  }

  // Determine subscription tier from price
  const priceId = subscription.items.data[0].price.id;
  const price = await stripe.prices.retrieve(priceId);
  const amount = price.unit_amount || 0;
  
  let subscriptionTier = "free";
  if (amount >= 4797) {
    subscriptionTier = "premium-plus";
  } else if (amount >= 2997) {
    subscriptionTier = "premium-pro";
  } else if (amount >= 1197) {
    subscriptionTier = "premium";
  }

  const subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
  const isActive = subscription.status === 'active';

  // Update subscribers table
  const { error: subscribersError } = await supabaseClient
    .from("subscribers")
    .upsert({
      email,
      stripe_customer_id: subscription.customer,
      subscribed: isActive,
      subscription_tier: subscriptionTier,
      subscription_status: subscription.status,
      subscription_end: subscriptionEnd,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

  if (subscribersError) {
    logStep("Error updating subscribers table", subscribersError);
  }

  // Update user_profiles table
  const { error: profilesError } = await supabaseClient
    .from("user_profiles")
    .update({
      subscription_tier: subscriptionTier,
      subscription_status: subscription.status,
      subscription_period_end: subscriptionEnd,
      meditation_minutes_limit: isActive ? 999999 : 60
    })
    .eq("email", email);

  if (profilesError) {
    logStep("Error updating user_profiles table", profilesError);
  }

  logStep("Subscription updated successfully", { 
    email, 
    subscriptionTier, 
    status: subscription.status 
  });
}

async function handleSubscriptionCancellation(
  supabaseClient: any,
  stripe: Stripe,
  subscription: Stripe.Subscription
) {
  logStep("Handling subscription cancellation", { subscriptionId: subscription.id });

  const customer = await stripe.customers.retrieve(subscription.customer as string);
  if (!customer || customer.deleted) {
    throw new Error("Customer not found or deleted");
  }

  const email = (customer as Stripe.Customer).email;
  if (!email) {
    throw new Error("Customer email not found");
  }

  // Update subscribers table
  await supabaseClient
    .from("subscribers")
    .upsert({
      email,
      stripe_customer_id: subscription.customer,
      subscribed: false,
      subscription_tier: "free",
      subscription_status: "cancelled",
      subscription_end: null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

  // Update user_profiles table
  await supabaseClient
    .from("user_profiles")
    .update({
      subscription_tier: "free",
      subscription_status: "cancelled",
      subscription_period_end: null,
      meditation_minutes_limit: 60
    })
    .eq("email", email);

  logStep("Subscription cancelled successfully", { email });
}

async function handleSuccessfulPayment(
  supabaseClient: any,
  stripe: Stripe,
  invoice: Stripe.Invoice
) {
  logStep("Handling successful payment", { invoiceId: invoice.id });

  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    await handleSubscriptionChange(supabaseClient, stripe, subscription, 'payment_succeeded');
  }
}

async function handleFailedPayment(
  supabaseClient: any,
  stripe: Stripe,
  invoice: Stripe.Invoice
) {
  logStep("Handling failed payment", { invoiceId: invoice.id });

  const customer = await stripe.customers.retrieve(invoice.customer as string);
  if (!customer || customer.deleted) {
    throw new Error("Customer not found or deleted");
  }

  const email = (customer as Stripe.Customer).email;
  if (!email) {
    throw new Error("Customer email not found");
  }

  // Update subscription status to indicate payment failure
  await supabaseClient
    .from("subscribers")
    .update({
      subscription_status: "past_due",
      updated_at: new Date().toISOString(),
    })
    .eq("email", email);

  await supabaseClient
    .from("user_profiles")
    .update({
      subscription_status: "past_due"
    })
    .eq("email", email);

  logStep("Payment failure handled", { email });
}
