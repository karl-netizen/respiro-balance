
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MoodSelector from "@/components/MoodSelector";
import BreathingVisualizer from "@/components/BreathingVisualizer";
import MeditationPlayer from "@/components/MeditationPlayer";
import WorkLifeBalance from "@/components/WorkLifeBalance";
import PricingTiers from "@/components/PricingTiers";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
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
        </div>
      </section>
      
      <BreathingVisualizer />
      <WorkLifeBalance />
      <PricingTiers />
      <Footer />
    </div>
  );
};

export default Index;
