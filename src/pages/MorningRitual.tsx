
import React, { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RitualHero from "@/components/morning-ritual/RitualHero";
import RitualTimeline from "@/components/morning-ritual/RitualTimeline";
import RitualForm from "@/components/morning-ritual/RitualForm";
import StreakTracker from "@/components/morning-ritual/StreakTracker";
import SuggestionsSection from "@/components/morning-ritual/SuggestionsSection";
import RitualValidationReport from "@/components/morning-ritual/validation/RitualValidationReport";
import RitualAnalyticsDashboard from "@/components/morning-ritual/analytics/RitualAnalyticsDashboard";
import { useUserPreferences } from "@/context";
import { useNotifications } from "@/context/NotificationsProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Helmet } from "react-helmet";
import { updateRitualStatuses } from "@/components/morning-ritual/utils";
import { MorningRitual as MorningRitualType } from "@/context/types";
import { Sunrise, Plus, Lightbulb, ClipboardCheck, BarChart3 } from "lucide-react";

const MorningRitual = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { addStreakAchievementNotification } = useNotifications();
  const rituals = preferences.morningRituals || [];
  const hasRituals = rituals.length > 0;

  // Update ritual statuses on page load
  useEffect(() => {
    if (rituals.length > 0) {
      const updatedRituals = updateRitualStatuses(rituals);
      
      // Check for streaks to notify about
      updatedRituals.forEach(ritual => {
        const originalRitual = rituals.find(r => r.id === ritual.id);
        
        if (originalRitual && ritual.streak > (originalRitual.streak || 0)) {
          addStreakAchievementNotification(ritual);
        }
      });
      
      const statusesChanged = JSON.stringify(updatedRituals) !== JSON.stringify(rituals);
      if (statusesChanged) {
        updatePreferences({ morningRituals: updatedRituals });
      }
    }
  }, [rituals, updatePreferences, addStreakAchievementNotification]);

  const completedToday = rituals.filter(ritual => {
    if (ritual.lastCompleted) {
      const lastCompleted = new Date(ritual.lastCompleted);
      const today = new Date();
      return lastCompleted.toDateString() === today.toDateString();
    }
    return false;
  }).length;

  return (
    <>
      <Helmet>
        <title>Morning Ritual Builder | MindFlow</title>
        <meta name="description" content="Create and manage your personalized morning rituals for a mindful start to each day" />
      </Helmet>
      <Header />
      <main className="min-h-screen">
        <RitualHero />
        
        <div className="container max-w-7xl mx-auto px-4 py-8">
          {/* Quick Stats */}
          {hasRituals && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Sunrise className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Morning Rituals</p>
                    <p className="text-2xl font-bold text-gray-800">{rituals.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed Today</p>
                    <p className="text-2xl font-bold text-gray-800">{completedToday}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    🔥
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Best Streak</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {Math.max(...rituals.map(r => r.streak || 0), 0)} days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Tabs defaultValue={hasRituals ? "my-rituals" : "create"} className="mt-6">
            <TabsList className="grid w-full max-w-2xl mx-auto mb-8 grid-cols-5">
              <TabsTrigger value="my-rituals" className="flex items-center gap-2">
                <Sunrise className="h-4 w-4" />
                My Rituals
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Suggestions
              </TabsTrigger>
              <TabsTrigger value="validation" className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4" />
                Validation
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-rituals" className="space-y-8">
              {hasRituals ? (
                <>
                  <StreakTracker 
                    totalRituals={rituals.length}
                    completedToday={completedToday}
                  />
                  <Separator className="my-8" />
                  <RitualTimeline />
                </>
              ) : (
                <div className="text-center p-12 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border-2 border-dashed border-orange-200">
                  <Sunrise className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Morning Rituals Yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Create your first morning ritual to establish a mindful start to each day. 
                    Morning rituals help you begin with intention and purpose.
                  </p>
                  <TabsTrigger value="create" className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Morning Ritual
                  </TabsTrigger>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="create">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Create New Morning Ritual</h2>
                  <p className="text-muted-foreground">
                    Design a meaningful morning ritual to start your day with mindfulness and intention
                  </p>
                </div>
                <RitualForm />
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="max-w-7xl mx-auto">
                {hasRituals ? (
                  <RitualAnalyticsDashboard rituals={rituals} />
                ) : (
                  <div className="text-center p-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-200">
                    <BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Analytics Available</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Create some morning rituals first to see detailed analytics and insights about your habits.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="suggestions">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Morning Ritual Suggestions</h2>
                  <p className="text-muted-foreground">
                    Explore inspiring morning ritual ideas to enhance your daily practice
                  </p>
                </div>
                <SuggestionsSection />
              </div>
            </TabsContent>

            <TabsContent value="validation">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Feature Validation Report</h2>
                  <p className="text-muted-foreground">
                    Comprehensive analysis of implemented vs. specified Morning Ritual features
                  </p>
                </div>
                <RitualValidationReport />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MorningRitual;
