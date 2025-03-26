
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MoodSelector from "@/components/MoodSelector";
import BreathingVisualizer from "@/components/BreathingVisualizer";
import MeditationPlayer from "@/components/MeditationPlayer";
import WorkLifeBalance from "@/components/work-life-balance";
import PricingTiers from "@/components/PricingTiers";
import Footer from "@/components/Footer";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const { preferences } = useUserPreferences();
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  
  useEffect(() => {
    // Show welcome back message for returning users who completed onboarding
    if (preferences.hasCompletedOnboarding) {
      setShowWelcomeBack(true);
      
      // Hide the message after 5 seconds
      const timer = setTimeout(() => {
        setShowWelcomeBack(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [preferences.hasCompletedOnboarding]);
  
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      
      {/* Welcome Back Toast for returning users */}
      {showWelcomeBack && (
        <div className="fixed top-20 right-4 z-40 glassmorphism-card p-4 animate-fade-in max-w-md">
          <div className="flex items-start">
            <div className="flex-1">
              <h3 className="font-medium">Welcome back!</h3>
              <p className="text-sm text-foreground/70">
                We've personalized your experience based on your preferences.
              </p>
            </div>
            <button 
              className="text-foreground/50 hover:text-foreground"
              onClick={() => setShowWelcomeBack(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
      
      <MoodSelector />
      
      <section className="py-16 px-6 bg-gradient-to-b from-transparent to-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Meditation</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Experience a preview of our guided meditations with this featured session.
            </p>
          </div>
          
          <MeditationPlayer />
          
          {preferences.hasCompletedOnboarding && (
            <div className="text-center mt-8">
              <Button className="bg-primary text-white" size="lg">
                <span>View Full Meditation Library</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
      
      <BreathingVisualizer />
      <WorkLifeBalance />
      <PricingTiers />
      <Footer />
      
      {/* Onboarding wizard will automatically show for first-time users */}
      <OnboardingWizard />
    </div>
  );
};

export default Index;
