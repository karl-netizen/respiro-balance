
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RitualHero from "@/components/morning-ritual/RitualHero";
import RitualTimeline from "@/components/morning-ritual/RitualTimeline";
import RitualForm from "@/components/morning-ritual/RitualForm";
import RitualCreationWizard from "@/components/morning-ritual/RitualCreationWizard";
import StreakTracker from "@/components/morning-ritual/StreakTracker";
import SuggestionsSection from "@/components/morning-ritual/SuggestionsSection";
import RitualValidationReport from "@/components/morning-ritual/validation/RitualValidationReport";
import RitualAnalyticsDashboard from "@/components/morning-ritual/analytics/RitualAnalyticsDashboard";
import DependencyManager from "@/components/morning-ritual/scheduling/DependencyManager";
import WeatherIntegration from "@/components/morning-ritual/scheduling/WeatherIntegration";
import { useUserPreferences } from "@/context";
import { useNotifications } from "@/context/NotificationsProvider";
import { useAdvancedScheduling } from "@/components/morning-ritual/hooks/useAdvancedScheduling";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Helmet } from "react-helmet";
import { updateRitualStatuses } from "@/components/morning-ritual/utils";
import { MorningRitual as MorningRitualType } from "@/context/types";
import { Sunrise, Plus, Lightbulb, ClipboardCheck, BarChart3, Settings, Calendar, Cloud } from "lucide-react";

const MorningRitual = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { addStreakAchievementNotification } = useNotifications();
  const [showCreationWizard, setShowCreationWizard] = useState(false);
  
  const {
    dependencies,
    weatherAlternatives,
    scheduleOptimization,
    addDependency,
    removeDependency,
    addWeatherAlternative,
    removeWeatherAlternative,
    updateWeatherAlternative,
    analyzeSchedule,
    optimizeSchedule
  } = useAdvancedScheduling();

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

  // Analyze schedule when rituals change
  useEffect(() => {
    if (rituals.length > 0) {
      analyzeSchedule();
    }
  }, [rituals, analyzeSchedule]);

  const completedToday = rituals.filter(ritual => {
    if (ritual.lastCompleted) {
      const lastCompleted = new Date(ritual.lastCompleted);
      const today = new Date();
      return lastCompleted.toDateString() === today.toDateString();
    }
    return false;
  }).length;

  const handleOptimizeSchedule = () => {
    optimizeSchedule();
  };

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
              {scheduleOptimization && (
                <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      %
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Schedule Score</p>
                      <p className="text-2xl font-bold text-gray-800">{scheduleOptimization.feasibilityScore}%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Schedule Optimization Card */}
          {hasRituals && scheduleOptimization && scheduleOptimization.conflicts.length > 0 && (
            <Card className="mb-8 border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-orange-600" />
                    Schedule Optimization
                  </span>
                  <Button onClick={handleOptimizeSchedule} size="sm">
                    Auto-Optimize
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scheduleOptimization.conflicts.slice(0, 3).map((conflict, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">
                        {conflict.ritual1} {conflict.ritual2 && `& ${conflict.ritual2}`} - {conflict.suggestion}
                      </span>
                      <Badge variant="outline">{conflict.type}</Badge>
                    </div>
                  ))}
                  {scheduleOptimization.conflicts.length > 3 && (
                    <p className="text-sm text-muted-foreground">
                      +{scheduleOptimization.conflicts.length - 3} more conflicts
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue={hasRituals ? "my-rituals" : "create"} className="mt-6">
            <TabsList className="grid w-full max-w-3xl mx-auto mb-8 grid-cols-7">
              <TabsTrigger value="my-rituals" className="flex items-center gap-2">
                <Sunrise className="h-4 w-4" />
                My Rituals
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create
              </TabsTrigger>
              <TabsTrigger value="scheduling" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Scheduling
              </TabsTrigger>
              <TabsTrigger value="weather" className="flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                Weather
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
                  <Button 
                    onClick={() => setShowCreationWizard(true)}
                    className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Morning Ritual
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="create">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Create New Morning Ritual</h2>
                  <p className="text-muted-foreground mb-4">
                    Design a meaningful morning ritual to start your day with mindfulness and intention
                  </p>
                  <Button 
                    onClick={() => setShowCreationWizard(true)}
                    className="mb-6"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Use Creation Wizard
                  </Button>
                </div>
                <RitualForm />
              </div>
            </TabsContent>

            <TabsContent value="scheduling">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Advanced Scheduling</h2>
                  <p className="text-muted-foreground">
                    Set up dependencies and optimize your morning ritual schedule
                  </p>
                </div>
                <DependencyManager
                  rituals={rituals}
                  dependencies={dependencies}
                  onDependencyAdd={addDependency}
                  onDependencyRemove={removeDependency}
                />
              </div>
            </TabsContent>

            <TabsContent value="weather">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Weather Integration</h2>
                  <p className="text-muted-foreground">
                    Create weather-based alternatives for your outdoor rituals
                  </p>
                </div>
                <WeatherIntegration
                  rituals={rituals}
                  alternatives={weatherAlternatives}
                  onAlternativeAdd={addWeatherAlternative}
                  onAlternativeRemove={removeWeatherAlternative}
                  onAlternativeUpdate={updateWeatherAlternative}
                />
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

        {/* Creation Wizard */}
        <RitualCreationWizard
          isOpen={showCreationWizard}
          onClose={() => setShowCreationWizard(false)}
          existingRituals={rituals}
        />
      </main>
      <Footer />
    </>
  );
};

export default MorningRitual;
