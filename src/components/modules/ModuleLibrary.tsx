import { MODULE_REGISTRY } from '@/lib/modules/moduleRegistry';
import { useModuleStore } from '@/store/moduleStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Lock, Sparkles } from 'lucide-react';
import { ModuleSwapDialog } from './ModuleSwapDialog';
import { useNavigate } from 'react-router-dom';

export function ModuleLibrary() {
  const navigate = useNavigate();
  const { 
    subscriptionTier, 
    activeModules, 
    activateModule, 
    canActivateModule 
  } = useModuleStore();

  // Safety check: ensure subscriptionTier has a valid value
  const safeTier = subscriptionTier || 'free';

  const modules = Object.values(MODULE_REGISTRY);

  const getBannerMessage = () => {
    if (safeTier === 'free') {
      return 'Upgrade to Standard or Premium to unlock power modules';
    }
    if (safeTier === 'standard') {
      return 'Biofeedback Lite is always active. Choose 1 additional module.';
    }
    return 'All modules unlocked! Enjoy the full Respiro experience.';
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Your Modules</h2>
        <p className="text-muted-foreground text-lg">{getBannerMessage()}</p>
      </div>

      {/* Subscription Status Banner */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <p className="text-xl font-semibold capitalize text-foreground">{safeTier}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Active Modules</p>
                <p className="text-xl font-semibold text-foreground">{activeModules.length} / {safeTier === 'premium' ? '5' : safeTier === 'standard' ? '2' : '0'}</p>
              </div>
            </div>
            {safeTier === 'free' && (
              <Button onClick={() => navigate('/subscription')} className="bg-primary hover:bg-primary/90">
                Upgrade Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Modules */}
      {activeModules.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Active Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeModules.map(moduleId => {
              const module = MODULE_REGISTRY[moduleId];
              if (!module) return null;

              const canSwap = !module.alwaysActive && safeTier === 'standard';

              return (
                <Card key={moduleId} className="border-2 border-success">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{module.icon}</span>
                        <div>
                          <CardTitle className="text-foreground">{module.name}</CardTitle>
                          <CardDescription>{module.shortDescription}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                        <Check className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {module.features.map(feature => (
                        <li key={feature} className="flex items-center gap-2 text-muted-foreground">
                          <Check className="w-4 h-4 text-success flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  {canSwap && (
                    <CardFooter className="border-t pt-4">
                      <ModuleSwapDialog currentModuleId={moduleId} />
                    </CardFooter>
                  )}
                  {module.alwaysActive && (
                    <CardFooter className="border-t pt-4">
                      <Badge variant="secondary" className="w-full justify-center">
                        Always Active with Standard+
                      </Badge>
                    </CardFooter>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Modules */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Available Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules
            .filter(module => !activeModules.includes(module.id))
            .map(module => {
              const canActivate = canActivateModule(module.id);

              return (
                <Card key={module.id} className="opacity-80 hover:opacity-100 transition-opacity">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{module.icon}</span>
                        <div>
                          <CardTitle className="text-foreground">{module.name}</CardTitle>
                          <CardDescription>{module.shortDescription}</CardDescription>
                        </div>
                      </div>
                      {!canActivate && (
                        <Badge variant="secondary">
                          <Lock className="w-3 h-3 mr-1" />
                          Locked
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {module.description}
                    </p>
                    <ul className="space-y-2 text-sm">
                      {module.features.map(feature => (
                        <li key={feature} className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {canActivate ? (
                      <Button 
                        className="w-full" 
                        onClick={() => activateModule(module.id)}
                      >
                        Activate Module
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        variant="outline" 
                        onClick={() => {
                          if (safeTier === 'free') {
                            navigate('/subscription');
                          }
                        }}
                      >
                        {safeTier === 'free' ? 'Upgrade to Activate' : 'Module Limit Reached'}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  );
}
