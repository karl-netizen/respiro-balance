
/**
 * Stripe payment utilities using direct payment links
 */

// The direct Stripe payment link
export const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/3cseYrgjmdtJ5AA8ww';

/**
 * Redirects the user to the Stripe payment page
 */
export const redirectToStripePayment = () => {
  window.location.href = STRIPE_PAYMENT_LINK;
};

/**
 * Opens the Stripe payment page in a new tab
 */
export const openStripePaymentInNewTab = () => {
  window.open(STRIPE_PAYMENT_LINK, '_blank');
};
