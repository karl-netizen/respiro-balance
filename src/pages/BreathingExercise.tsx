
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreathingVisualizer from "@/components/BreathingVisualizer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Clock, Wind } from "lucide-react";

const BreatheTechniques = [
  {
    id: "box",
    name: "Box Breathing",
    description: "Equal inhale, hold, exhale, and pause. Great for focus and stress reduction.",
    pattern: "4-4-4-4",
    benefits: ["Reduces stress", "Improves focus", "Calms the nervous system"]
  },
  {
    id: "478",
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8. Perfect for sleep and anxiety.",
    pattern: "4-7-8",
    benefits: ["Promotes sleep", "Reduces anxiety", "Helps control cravings"]
  },
  {
    id: "coherent",
    name: "Coherent Breathing",
    description: "Slow, rhythmic breathing at about 5-6 breaths per minute.",
    pattern: "5-5",
    benefits: ["Balances autonomic system", "Improves heart rate variability", "Increases calm"]
  }
];

const BreathingExercise = () => {
  const [searchParams] = useSearchParams();
  const [selectedTechnique, setSelectedTechnique] = useState("box");
  const [activeTab, setActiveTab] = useState("visualizer");
  
  // Set initial tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'techniques') {
      setActiveTab('techniques');
    }
  }, [searchParams]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-background to-secondary/20 pt-24 pb-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Breathe</h1>
              <p className="text-foreground/70 text-lg max-w-3xl mx-auto">
                Conscious breathing is your tool for instant calm. Use these exercises anytime to reduce stress and improve focus.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="visualizer">Breathing Visualizer</TabsTrigger>
                <TabsTrigger value="techniques">Techniques</TabsTrigger>
              </TabsList>
              
              <TabsContent value="visualizer" className="mt-0">
                <BreathingVisualizer />
              </TabsContent>
              
              <TabsContent value="techniques" className="mt-0">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {BreatheTechniques.map((technique) => (
                    <Card 
                      key={technique.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedTechnique === technique.id ? "border-primary ring-2 ring-primary/20" : ""
                      }`}
                      onClick={() => setSelectedTechnique(technique.id)}
                    >
                      <CardHeader>
                        <CardTitle>{technique.name}</CardTitle>
                        <CardDescription>Pattern: {technique.pattern}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{technique.description}</p>
                        <div className="text-sm text-foreground/70">
                          <strong>Benefits:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {technique.benefits.map((benefit, i) => (
                              <li key={i}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="bg-secondary/20 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">How to Practice</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-background/80 p-4 rounded-md">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-medium mb-2">Set Aside Time</h4>
                      <p className="text-sm text-foreground/70">
                        Start with just 5 minutes daily. Gradually increase as the practice becomes familiar.
                      </p>
                    </div>
                    
                    <div className="bg-background/80 p-4 rounded-md">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                        <Wind className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-medium mb-2">Focus on Technique</h4>
                      <p className="text-sm text-foreground/70">
                        Follow the breathing pattern precisely. The timing is important for maximum benefit.
                      </p>
                    </div>
                    
                    <div className="bg-background/80 p-4 rounded-md">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                        <ArrowRight className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-medium mb-2">Be Consistent</h4>
                      <p className="text-sm text-foreground/70">
                        Practice at the same time each day to build a consistent habit and maximize benefits.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default BreathingExercise;
