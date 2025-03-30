
import { Link } from "react-router-dom";
import { useUserPreferences } from "@/context";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const Footer = () => {
  const { preferences } = useUserPreferences();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/20 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Respiro Balance</h3>
            <p className="text-sm text-foreground/70">
              Your daily companion for mindfulness, meditation, and work-life balance.
            </p>
            {preferences.businessAttribution && (
              <p className="text-xs text-foreground/60">
                Brought to you by {preferences.businessAttribution}
              </p>
            )}
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Features</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/#balance" className="hover:text-primary transition-colors">Work-Life Balance</Link></li>
              <li><Link to="/#features" className="hover:text-primary transition-colors">Meditation</Link></li>
              <li><Link to="/breathe" className="hover:text-primary transition-colors">Breathing Exercises</Link></li>
              <li><Link to="/progress" className="hover:text-primary transition-colors">Progress Tracking</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors flex items-center gap-1">
                  <HelpCircle className="h-3.5 w-3.5" /> 
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-foreground/10">
          <div className="mb-8">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary" />
              Frequently Asked Questions
            </h4>
            <Accordion type="single" collapsible className="bg-background/50 rounded-md">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-sm px-4">
                  How does the breathing exercise feature work?
                </AccordionTrigger>
                <AccordionContent className="text-sm px-4 text-muted-foreground">
                  Our breathing exercises guide you through timed breathing patterns that help reduce stress and improve focus. 
                  Simply follow the visual cues on screen to inhale and exhale at the recommended pace. You can customize the 
                  duration and intensity based on your preferences.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-sm px-4">
                  Can I use Respiro Balance without creating an account?
                </AccordionTrigger>
                <AccordionContent className="text-sm px-4 text-muted-foreground">
                  Yes! You can access basic features like breathing exercises and meditation sessions without creating an account. 
                  However, creating a free account allows you to track your progress, save your preferences, and access personalized recommendations.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-sm px-4">
                  How does progress tracking work?
                </AccordionTrigger>
                <AccordionContent className="text-sm px-4 text-muted-foreground">
                  Our progress tracking feature automatically records your meditation sessions, breathing exercises, and other wellness activities. 
                  You can view your trends over time, set goals, and earn achievements as you build consistent habits. All your data is private and secure.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-sm px-4">
                  Is there a mobile app available?
                </AccordionTrigger>
                <AccordionContent className="text-sm px-4 text-muted-foreground">
                  Yes, Respiro Balance is available as a mobile app for both iOS and Android devices. You can download it from the App Store or Google Play Store.
                  Your account and progress will sync across all your devices.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-sm px-4">
                  How do I cancel my subscription?
                </AccordionTrigger>
                <AccordionContent className="text-sm px-4 text-muted-foreground">
                  You can cancel your subscription at any time from your account settings. Navigate to "Subscription" and click "Cancel Subscription". 
                  You'll continue to have access to premium features until the end of your current billing period. We don't offer refunds for partial subscription periods.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        
        <div className="pt-6 border-t border-foreground/10 text-sm text-foreground/60 flex flex-col md:flex-row justify-between items-center">
          <div>
            &copy; {currentYear} Respiro Balance. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-4">
              <a 
                href="https://kgpcoaching.com.au/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors"
              >
                KGP Coaching & Consulting
              </a>
              <span>|</span>
              <a href="https://learnrelaxation.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                LearnRelaxation
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
