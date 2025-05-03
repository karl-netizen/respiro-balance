
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BreathingVisualizer } from '@/components/breathing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Clock, Wind, Heart, Star } from "lucide-react";
import { toast } from 'sonner';

const BreatheTechniques = [
  {
    id: "box",
    name: "Box Breathing",
    description: "Equal inhale, hold, exhale, and pause. Great for focus and stress reduction.",
    pattern: "4-4-4-4",
    benefits: ["Reduces stress", "Improves focus", "Calms the nervous system"],
    color: "blue"
  },
  {
    id: "478",
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8. Perfect for sleep and anxiety.",
    pattern: "4-7-8",
    benefits: ["Promotes sleep", "Reduces anxiety", "Helps control cravings"],
    color: "indigo"
  },
  {
    id: "coherent",
    name: "Coherent Breathing",
    description: "Slow, rhythmic breathing at about 5-6 breaths per minute.",
    pattern: "5-5",
    benefits: ["Balances autonomic system", "Improves heart rate variability", "Increases calm"],
    color: "teal"
  },
  {
    id: "alternate",
    name: "Alternate Nostril",
    description: "Balance breathing between left and right nostrils. Promotes balance and clarity.",
    pattern: "4-4-4-4",
    benefits: ["Balances hemispheres", "Improves mental clarity", "Reduces stress"],
    color: "purple"
  }
];

const Breathe = () => {
  const [searchParams] = useSearchParams();
  const [selectedTechnique, setSelectedTechnique] = useState("box");
  const [activeTab, setActiveTab] = useState("visualizer");
  const [completedSessions, setCompletedSessions] = useState<{[key: string]: number}>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Set initial tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'techniques') {
      setActiveTab('techniques');
    }
    
    // Load completed sessions from localStorage
    const savedSessions = localStorage.getItem('breathingCompletedSessions');
    if (savedSessions) {
      setCompletedSessions(JSON.parse(savedSessions));
    }
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('breathingFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, [searchParams]);
  
  const handleSelectTechnique = (techniqueId: string) => {
    setSelectedTechnique(techniqueId);
    toast.info(`Selected ${BreatheTechniques.find(t => t.id === techniqueId)?.name}`);
    
    if (activeTab === 'techniques') {
      setActiveTab('visualizer');
    }
  };
  
  const handleCompletedSession = (techniqueId: string, durationMinutes: number) => {
    const newCompleted = { ...completedSessions };
    newCompleted[techniqueId] = (newCompleted[techniqueId] || 0) + durationMinutes;
    setCompletedSessions(newCompleted);
    localStorage.setItem('breathingCompletedSessions', JSON.stringify(newCompleted));
    
    toast.success(`Completed ${durationMinutes} minute${durationMinutes !== 1 ? 's' : ''} of ${
      BreatheTechniques.find(t => t.id === techniqueId)?.name
    }`);
  };
  
  const handleToggleFavorite = (techniqueId: string) => {
    let newFavorites: string[];
    if (favorites.includes(techniqueId)) {
      newFavorites = favorites.filter(id => id !== techniqueId);
      toast.info(`Removed ${BreatheTechniques.find(t => t.id === techniqueId)?.name} from favorites`);
    } else {
      newFavorites = [...favorites, techniqueId];
      toast.success(`Added ${BreatheTechniques.find(t => t.id === techniqueId)?.name} to favorites`);
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('breathingFavorites', JSON.stringify(newFavorites));
  };
  
  const isFavorite = (techniqueId: string): boolean => {
    return favorites.includes(techniqueId);
  };

  const totalMinutesCompleted = Object.values(completedSessions).reduce((sum, minutes) => sum + minutes, 0);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-background to-secondary/20 pt-16 pb-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Breathe</h1>
              <p className="text-foreground/70 text-lg max-w-3xl mx-auto">
                Conscious breathing is your tool for instant calm. Use these exercises anytime to reduce stress and improve focus.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <div className="bg-card border rounded-md p-4 flex items-center gap-3">
                  <Clock className="text-primary h-5 w-5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Time</p>
                    <p className="font-medium">{totalMinutesCompleted} minutes</p>
                  </div>
                </div>
                <div className="bg-card border rounded-md p-4 flex items-center gap-3">
                  <Wind className="text-primary h-5 w-5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Techniques Tried</p>
                    <p className="font-medium">{Object.keys(completedSessions).length} / {BreatheTechniques.length}</p>
                  </div>
                </div>
                {Object.keys(completedSessions).length > 0 && (
                  <div className="bg-card border rounded-md p-4 flex items-center gap-3">
                    <Heart className="text-primary h-5 w-5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Favorite Technique</p>
                      <p className="font-medium">
                        {BreatheTechniques.find(t => t.id === 
                          Object.entries(completedSessions)
                            .sort((a, b) => b[1] - a[1])[0]?.[0]
                        )?.name || "None yet"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="visualizer">Breathing Visualizer</TabsTrigger>
                <TabsTrigger value="techniques">Techniques</TabsTrigger>
              </TabsList>
              
              <TabsContent value="visualizer" className="mt-0">
                <BreathingVisualizer 
                  selectedTechnique={selectedTechnique}
                  onSessionComplete={handleCompletedSession}
                />
              </TabsContent>
              
              <TabsContent value="techniques" className="mt-0">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {BreatheTechniques.map((technique) => (
                    <Card 
                      key={technique.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedTechnique === technique.id ? "border-primary ring-2 ring-primary/20" : ""
                      }`}
                    >
                      <div className="flex justify-end pt-2 pr-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(technique.id);
                          }}
                          className={`p-1 rounded-full ${
                            isFavorite(technique.id) 
                              ? 'text-primary' 
                              : 'text-muted-foreground'
                          }`}
                        >
                          <Star className="h-5 w-5" fill={isFavorite(technique.id) ? "currentColor" : "none"} />
                        </button>
                      </div>
                      <CardHeader className="pt-0">
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
                        
                        <div className="mt-4 flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            {completedSessions[technique.id] 
                              ? `${completedSessions[technique.id]} min completed` 
                              : 'Not tried yet'}
                          </div>
                          <button 
                            onClick={() => handleSelectTechnique(technique.id)}
                            className="text-primary hover:underline text-sm font-medium"
                          >
                            Try Now
                          </button>
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

export default Breathe;
