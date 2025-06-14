
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MorningRitual } from '@/context/types';
import { Sunrise, Plus, BarChart3 } from 'lucide-react';
import RitualTimeline from '@/components/morning-ritual/RitualTimeline';
import RitualForm from '@/components/morning-ritual/RitualForm';
import StreakTracker from '@/components/morning-ritual/StreakTracker';
import SuggestionsSection from '@/components/morning-ritual/SuggestionsSection';
import RitualAnalyticsDashboard from '@/components/morning-ritual/analytics/RitualAnalyticsDashboard';
import RitualValidationReport from '@/components/morning-ritual/validation/RitualValidationReport';
import DependencyManager from '@/components/morning-ritual/scheduling/DependencyManager';
import WeatherIntegration from '@/components/morning-ritual/scheduling/WeatherIntegration';

interface MorningRitualTabsContentProps {
  hasRituals: boolean;
  rituals: MorningRitual[];
  completedToday: number;
  onShowCreationWizard: () => void;
  dependencies: any[];
  weatherAlternatives: any[];
  addDependency: (dep: any) => void;
  removeDependency: (id: string) => void;
  addWeatherAlternative: (alt: any) => void;
  removeWeatherAlternative: (id: string) => void;
  updateWeatherAlternative: (alt: any) => void;
}

const MorningRitualTabsContent: React.FC<MorningRitualTabsContentProps> = ({
  hasRituals,
  rituals,
  completedToday,
  onShowCreationWizard,
  dependencies,
  weatherAlternatives,
  addDependency,
  removeDependency,
  addWeatherAlternative,
  removeWeatherAlternative,
  updateWeatherAlternative
}) => {
  return (
    <>
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
              onClick={onShowCreationWizard}
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
              onClick={onShowCreationWizard}
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
    </>
  );
};

export default MorningRitualTabsContent;
