
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DailyQuote from "@/components/DailyQuote";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";

const FAQ = () => {
  const [expandedFaq, setExpandedFaq] = useState<string | null>("item-1");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
          <p className="text-center text-muted-foreground mb-8">
            Find answers to the most common questions about our mindfulness app
          </p>
          
          {/* Daily Motivational Quote */}
          <div className="mb-12">
            <DailyQuote />
          </div>
          
          <Accordion
            type="single"
            collapsible
            value={expandedFaq || undefined}
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
          </Accordion>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
