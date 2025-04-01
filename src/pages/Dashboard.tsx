
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import MoodSelector from "@/components/MoodSelector";
import BreathingVisualizer from "@/components/BreathingVisualizer";
import MeditationPlayer from "@/components/MeditationPlayer";
import WorkLifeBalance from "@/components/work-life-balance";
import Footer from "@/components/Footer";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import DailyQuote from "@/components/DailyQuote";
import { useUserPreferences } from "@/context";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
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

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Personalize content based on user preferences
  const getPersonalizedContent = () => {
    if (!preferences.hasCompletedOnboarding) {
      return "Complete the onboarding process to personalize your experience.";
    }

    const timeBasedMessages = {
      morning: "Start your day with a short meditation session.",
      afternoon: "Take a quick breathing break to maintain focus.",
      evening: "Wind down with a relaxation session before bed."
    };

    const hour = new Date().getHours();
    if (hour < 12) return timeBasedMessages.morning;
    if (hour < 18) return timeBasedMessages.afternoon;
    return timeBasedMessages.evening;
  };
  
  return (
    <div className="min-h-screen">
      <Header />
      
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
      
      {/* Personalized Hero Section */}
      <div className="py-16 pt-28 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-3">
            {getGreeting()}{preferences.hasCompletedOnboarding && preferences.userRole ? `, ${preferences.userRole}` : ""}
          </h1>
          
          <p className="text-center text-muted-foreground mb-6">
            {getPersonalizedContent()}
          </p>
          
          <DailyQuote />
        </div>
      </div>
      
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
              <Button className="bg-primary text-white" size="lg" asChild>
                <Link to="/meditate">
                  <span>View Full Meditation Library</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
      
      <BreathingVisualizer />
      
      {/* Personalized Section based on preferences */}
      {preferences.hasCompletedOnboarding && preferences.morningRituals && (
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Morning Ritual</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Start your day with intention and mindfulness.
              </p>
            </div>
            
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <Link to="/morning-ritual">
                  <span>View Morning Ritual</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
      
      <WorkLifeBalance />
      
      <Footer />
      
      {/* Onboarding wizard will automatically show for first-time users */}
      <OnboardingWizard />
    </div>
  );
};

export default Dashboard;
