
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

const SubscriptionFAQs = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What's included in the Premium plan?</AccordionTrigger>
            <AccordionContent>
              The Premium plan includes unlimited meditation minutes, advanced meditation techniques,
              full biometric integration, personalized recommendations, offline access to all content,
              detailed progress tracking, and priority customer support.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I cancel my subscription anytime?</AccordionTrigger>
            <AccordionContent>
              Yes, you can cancel your subscription at any time from your account settings.
              You'll continue to have access to Premium features until the end of your current billing period.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>How does the monthly usage limit work for free users?</AccordionTrigger>
            <AccordionContent>
              Free users have a limit of 60 meditation minutes per month. This resets on the first day
              of each month. Once you've used your allotted minutes, you'll need to upgrade to Premium
              for unlimited access or wait until the next month.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger>Is there a refund policy?</AccordionTrigger>
            <AccordionContent>
              If you're not satisfied with your Premium subscription, you can request a refund within
              7 days of your initial purchase by contacting our support team. Refunds are not available
              for partial months or for subscriptions that have been active for more than 7 days.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger>How do I switch between monthly and annual billing?</AccordionTrigger>
            <AccordionContent>
              You can switch between monthly and annual billing in your account settings under the
              Subscription tab. If you switch from monthly to annual, you'll be charged the annual
              rate immediately, with credit for any remaining time on your monthly plan. If you switch
              from annual to monthly, the change will take effect at the end of your current annual billing cycle.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-6">
            <AccordionTrigger>Can I use my subscription on multiple devices?</AccordionTrigger>
            <AccordionContent>
              Yes, your subscription is tied to your account, not your device. You can access your
              Premium features on any device where you're logged into your Respiro Balance account.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-7">
            <AccordionTrigger>Do you offer team or family plans?</AccordionTrigger>
            <AccordionContent>
              Yes, we offer team plans for businesses and organizations. Please contact our sales team
              for more information about team pricing and features. We're also working on family plans
              which will be available soon.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default SubscriptionFAQs;
