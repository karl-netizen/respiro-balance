
import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import RitualHero from "@/components/morning-ritual/RitualHero";
import RitualTimeline from "@/components/morning-ritual/RitualTimeline";
import RitualForm from "@/components/morning-ritual/RitualForm";
import StreakTracker from "@/components/morning-ritual/StreakTracker";
import SuggestionsSection from "@/components/morning-ritual/SuggestionsSection";
import { useUserPreferences } from "@/context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Helmet } from "react-helmet";

const MorningRitual = () => {
  const { preferences } = useUserPreferences();
  const hasRituals = preferences.morningRituals && preferences.morningRituals.length > 0;

  return (
    <>
      <Helmet>
        <title>Morning Ritual Builder | MindFlow</title>
      </Helmet>
      <Header />
      <main className="min-h-screen">
        <RitualHero />
        
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <Tabs defaultValue={hasRituals ? "my-rituals" : "create"} className="mt-6">
            <TabsList className="grid w-full max-w-md mx-auto mb-8 grid-cols-3">
              <TabsTrigger value="my-rituals">My Rituals</TabsTrigger>
              <TabsTrigger value="create">Create New</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-rituals" className="space-y-8">
              {hasRituals ? (
                <>
                  <StreakTracker />
                  <Separator className="my-8" />
                  <RitualTimeline />
                </>
              ) : (
                <div className="text-center p-12 bg-slate-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">No rituals yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first morning ritual to get started on your wellness journey.
                  </p>
                  <TabsTrigger value="create" className="bg-primary text-white px-4 py-2 rounded-md">
                    Create Your First Ritual
                  </TabsTrigger>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="create">
              <RitualForm />
            </TabsContent>
            
            <TabsContent value="suggestions">
              <SuggestionsSection />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MorningRitual;
