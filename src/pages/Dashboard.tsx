import React, { Suspense, lazy } from 'react';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardLayout, { DashboardTopSection } from '@/components/dashboard/DashboardLayout';
import DashboardMainContent from '@/components/dashboard/DashboardMainContent';
import MoodCheckModal from '@/components/dashboard/MoodCheckModal';
import MoodDashboardHeader from '@/components/dashboard/MoodDashboardHeader';
import { DashboardWelcome, DashboardQuickAccess } from '@/components/dashboard';
import { MODULE_REGISTRY } from '@/lib/modules/moduleRegistry';
import { useModuleStore } from '@/store/moduleStore';
import { useBiofeedbackStore } from '@/store/biofeedbackStore';
import { WeeklyReportCard } from '@/components/biofeedback/WeeklyReportCard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Package, Settings, Activity, Boxes } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Lazy load module components
const BiofeedbackModule = lazy(() => import('@/components/modules/BiofeedbackModule'));
const FocusModule = lazy(() => import('@/components/modules/FocusModule'));
const MorningRitualsModule = lazy(() => import('@/components/modules/MorningRitualsModule'));
const SocialModule = lazy(() => import('@/components/modules/SocialModule'));
const WorkLifeBalanceModule = lazy(() => import('@/components/modules/WorkLifeBalanceModule'));

// Map module IDs to components
const MODULE_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  biofeedback: BiofeedbackModule,
  focus: FocusModule,
  morning_rituals: MorningRitualsModule,
  social: SocialModule,
  work_life_balance: WorkLifeBalanceModule,
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { activeModules, subscriptionTier } = useModuleStore();
  const { isConnected, sessionInsights } = useBiofeedbackStore();

  return (
    <div className="min-h-screen bg-background">
      <DashboardContainer>
        {({
          user,
          currentPeriod,
          meditationStats,
          currentStreak,
          weeklyGoal,
          weeklyProgress,
          progressPercentage,
          welcomeMessage,
          userName,
          dailyMood,
          showMoodModal,
          quickStats,
          handleMoodModalSelect,
          handleMoodChange,
          handleGoBack,
          setShowMoodModal,
        }) => (
          <>
            {/* Header with Back Button */}
            <DashboardHeader onGoBack={handleGoBack} />

            {/* Module Management Quick Access */}
            <div className="container mx-auto px-4 py-4">
              <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Boxes className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          Power Modules
                          <Badge variant="secondary" className="text-xs">
                            {activeModules.length} active
                          </Badge>
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {subscriptionTier === 'free' 
                            ? 'Upgrade to unlock Focus Mode, Morning Rituals & more'
                            : 'Activate modules to enhance your wellness journey'}
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate(subscriptionTier === 'free' ? '/subscription' : '/modules')}
                      className="flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      {subscriptionTier === 'free' ? 'Upgrade' : 'Manage Modules'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DashboardLayout>
              {/* Mood Check Modal */}
              <MoodCheckModal 
                open={showMoodModal}
                onMoodSelect={handleMoodModalSelect}
              />

              {/* Welcome Section */}
              <DashboardTopSection
                welcomeSection={
                  <DashboardWelcome 
                    welcomeMessage={welcomeMessage}
                    currentPeriod={currentPeriod as 'morning' | 'afternoon' | 'evening'}
                    quickStats={quickStats}
                  />
                }
              />

              {/* Mood Dashboard Header */}
              {dailyMood && (
                <div className="mb-6">
                  <MoodDashboardHeader 
                    currentMood={dailyMood}
                    onMoodChange={handleMoodChange}
                  />
                </div>
              )}

              {/* Progress and Actions Section */}
              <DashboardMainContent
                weeklyProgress={weeklyProgress}
                weeklyGoal={weeklyGoal}
                progressPercentage={progressPercentage}
                currentMood={dailyMood}
                onMoodSelect={handleMoodModalSelect}
                currentStreak={currentStreak}
              />

              {/* Active Module Widgets */}
              {activeModules.length > 0 && (
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" />
                      Your Active Modules
                    </h2>
                    <div className="flex items-center gap-2">
                      {isConnected && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate('/biofeedback/settings')}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Biofeedback
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/modules')}
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeModules.map(moduleId => {
                      const module = MODULE_REGISTRY[moduleId];
                      if (!module) return null;

                      const ModuleComponent = MODULE_COMPONENTS[moduleId];
                      if (!ModuleComponent) return null;

                      return (
                        <Suspense
                          key={moduleId}
                          fallback={
                            <Card>
                              <CardContent className="p-6">
                                <Skeleton className="h-32 w-full" />
                              </CardContent>
                            </Card>
                          }
                        >
                          <ModuleComponent />
                        </Suspense>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Weekly Wellness Report */}
              {isConnected && sessionInsights.length > 0 && (
                <div className="space-y-4 mb-6">
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Wellness Insights
                  </h2>
                  <WeeklyReportCard />
                </div>
              )}

              {/* No Modules Message */}
              {activeModules.length === 0 && (
                <Card className="mb-6 border-dashed">
                  <CardContent className="p-12 text-center">
                    <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {subscriptionTier === 'free' 
                        ? 'Unlock Power Modules'
                        : 'Activate Your First Module'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {subscriptionTier === 'free' 
                        ? 'Upgrade to Standard or Premium to access Focus Mode, Morning Rituals, and more.'
                        : 'Choose from Focus Mode, Morning Rituals, Social Hub, and Work-Life Balance.'}
                    </p>
                    <Button onClick={() => navigate(subscriptionTier === 'free' ? '/subscription' : '/modules')}>
                      {subscriptionTier === 'free' ? 'Upgrade Now' : 'Browse Modules'}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Quick Access Tabs */}
              <DashboardQuickAccess />
            </DashboardLayout>
          </>
        )}
      </DashboardContainer>
    </div>
  );
};

export default React.memo(Dashboard);
