
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SubscriptionFAQs: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What's included in the free plan?</AccordionTrigger>
          <AccordionContent>
            The free plan includes 60 minutes of guided meditation per month, basic breathing exercises,
            simple tracking tools, and daily reminders. It's a great way to get started with mindfulness
            and see how Respiro Balance can help improve your wellbeing.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2">
          <AccordionTrigger>How does the 14-day free trial work?</AccordionTrigger>
          <AccordionContent>
            When you sign up for our Premium plan, you'll get full access to all features for 14 days 
            completely free. You won't be charged until the trial period ends, and you can cancel anytime
            before the trial ends without being charged.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3">
          <AccordionTrigger>Can I cancel my subscription anytime?</AccordionTrigger>
          <AccordionContent>
            Yes! You can cancel your subscription at any time. If you cancel, you'll continue to have access
            to Premium features until the end of your current billing period. After that, your account will
            automatically revert to the free plan.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-4">
          <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
          <AccordionContent>
            We accept all major credit and debit cards, including Visa, Mastercard, American Express, 
            and Discover. Payment processing is handled securely through Stripe.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-5">
          <AccordionTrigger>Is my payment information secure?</AccordionTrigger>
          <AccordionContent>
            Absolutely. We use Stripe, a PCI-compliant payment processor, for all transactions. 
            Your payment details are encrypted and securely stored with Stripe - we never see or 
            store your full credit card information on our servers.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-6">
          <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
          <AccordionContent>
            If you're unsatisfied with your Premium subscription for any reason, please contact 
            our support team within 7 days of your payment, and we'll be happy to issue a refund.
            After this period, refunds are handled on a case-by-case basis.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SubscriptionFAQs;
