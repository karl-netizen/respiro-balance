
import { useState } from "react";
import Header from "@/components/Header";

import DailyQuote from "@/components/DailyQuote";
import SubscriptionFAQs from "@/components/subscription/SubscriptionFAQs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FAQ = () => {
  // Initialize with no expanded items
  const [expandedFaq, setExpandedFaq] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 mt-16">
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
          <p className="text-center text-muted-foreground mb-8">
            Find answers to the most common questions about our mindfulness app
          </p>
          
          {/* Daily Motivational Quote */}
          <div className="mb-12">
            <DailyQuote />
          </div>
          
          <Tabs
            defaultValue="general"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="general">General FAQs</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <Accordion
                type="single"
                collapsible
                value={expandedFaq}
                onValueChange={(value) => setExpandedFaq(value)}
                className="bg-card rounded-lg shadow-sm"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5">
                    <span className="font-medium">How does the breathing exercise help reduce stress?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    Our guided breathing exercises activate your parasympathetic nervous system, which helps reduce cortisol levels and induce a state of calm. Regular practice can improve your body's stress response over time.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5">
                    <span className="font-medium">Can I use the app offline?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    Yes! Many features like breathing exercises and basic meditations can be used offline. The app will automatically sync your progress when you reconnect to the internet.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5">
                    <span className="font-medium">What is the difference between the free and premium plans?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    The free plan gives you access to basic meditation sessions and breathing exercises. Premium unlocks our full library of guided meditations, personalized recommendations, progress tracking, and biofeedback integration features.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5">
                    <span className="font-medium">How do I connect biofeedback devices?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    To connect a compatible biofeedback device, go to Settings &gt; Biofeedback Devices and follow the pairing instructions. Our app supports most Bluetooth-enabled heart rate monitors and certain dedicated mindfulness wearables.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5">
                    <span className="font-medium">How often should I meditate to see results?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    Research suggests that meditating for just 10 minutes daily can produce noticeable benefits within 2-3 weeks. Consistency is more important than duration, so we recommend starting with short daily sessions rather than occasional longer ones.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5">
                    <span className="font-medium">How are achievements unlocked in the app?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    Achievements are unlocked by hitting specific milestones in your meditation journey. These include completing a certain number of sessions, maintaining streaks, trying different meditation types, and accumulating meditation minutes. When you unlock an achievement, you'll receive a notification.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-7">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5">
                    <span className="font-medium">How does the progress analytics system work?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    Our progress analytics system tracks various aspects of your meditation practice and correlates them with your reported well-being metrics. It analyzes patterns in your practice times, duration, frequency, and matches these with changes in your stress levels, focus, and mood. This helps identify which meditation practices work best for your specific needs.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-8">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5">
                    <span className="font-medium">Can I share my progress with others?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    Yes! The app allows you to generate shareable progress reports that you can download as PDF or image files. You can customize what data to include in these reports before sharing with friends, family, or your wellness coach. All shared reports maintain your privacy by only including the information you choose to share.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-9">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5">
                    <span className="font-medium">How accurate are the biometric correlations?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    The accuracy of biometric correlations depends on several factors including the quality of your connected devices, consistency of use, and individual physiology. While our algorithms apply scientific research in calculating these correlations, they should be viewed as helpful indicators rather than medical-grade diagnostics. Always consult healthcare professionals for medical advice.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-10">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5">
                    <span className="font-medium">What do the different wellness scores mean?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    Our wellness scores are composite metrics calculated from various inputs including your meditation consistency, biometric readings, self-reported mood and stress levels, and sleep quality (if tracked). Scores typically range from 0-100, with higher scores indicating better overall well-being. The app provides personalized insights to help you understand what factors are influencing your scores and how to improve them.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            
            <TabsContent value="subscription">
              <div className="bg-card rounded-lg shadow-sm p-6">
                <SubscriptionFAQs />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      
    </div>
  );
};

export default FAQ;
