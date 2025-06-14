
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Activity, Brain } from 'lucide-react';
import { crossModuleNavigation } from '@/services/CrossModuleNavigationService';
import { useNavigate } from 'react-router-dom';

interface CrossModuleActionsProps {
  currentModule: string;
  sessionData?: any;
  userContext?: any;
  className?: string;
}

export const CrossModuleActions: React.FC<CrossModuleActionsProps> = ({
  currentModule,
  sessionData,
  userContext,
  className = ""
}) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    crossModuleNavigation.setNavigate(navigate);
  }, [navigate]);

  const getActionsForModule = () => {
    switch (currentModule) {
      case 'meditation':
        return [
          {
            label: 'View Progress',
            icon: <TrendingUp className="h-4 w-4" />,
            action: () => crossModuleNavigation.fromMeditationToProgress(sessionData),
            description: 'See how this session improved your metrics'
          },
          {
            label: 'Breathing Exercise',
            icon: <Activity className="h-4 w-4" />,
            action: () => crossModuleNavigation.navigateWithContext('/breathing', {
              sourceModule: 'meditation',
              recommendationReason: 'Enhance your practice with breathing'
            }),
            description: 'Complement with breathing exercises'
          }
        ];
      
      case 'progress':
        return [
          {
            label: 'Try Recommended Session',
            icon: <Brain className="h-4 w-4" />,
            action: () => crossModuleNavigation.fromProgressToMeditation('recommended'),
            description: 'Based on your progress patterns'
          },
          {
            label: 'Start Focus Session',
            icon: <ArrowRight className="h-4 w-4" />,
            action: () => crossModuleNavigation.navigateWithContext('/focus', {
              sourceModule: 'progress',
              recommendationReason: 'Apply your mindfulness to focused work'
            }),
            description: 'Apply mindfulness to productivity'
          }
        ];
      
      case 'focus':
        return [
          {
            label: 'Stress Relief',
            icon: <Activity className="h-4 w-4" />,
            action: () => crossModuleNavigation.fromFocusToBreathing(userContext?.stressLevel || 50),
            description: 'Quick stress relief after focused work'
          },
          {
            label: 'View Analytics',
            icon: <TrendingUp className="h-4 w-4" />,
            action: () => crossModuleNavigation.navigateWithContext('/progress?tab=overview', {
              sourceModule: 'focus',
              recommendationReason: 'Check your focus improvements'
            }),
            description: 'See your focus trends and patterns'
          }
        ];
      
      case 'breathing':
        return [
          {
            label: 'Meditation Session',
            icon: <Brain className="h-4 w-4" />,
            action: () => crossModuleNavigation.navigateWithContext('/meditation?tab=guided', {
              sourceModule: 'breathing',
              recommendationReason: 'Deepen your practice with meditation'
            }),
            description: 'Continue with guided meditation'
          },
          {
            label: 'Focus Time',
            icon: <ArrowRight className="h-4 w-4" />,
            action: () => crossModuleNavigation.navigateWithContext('/focus', {
              sourceModule: 'breathing',
              recommendationReason: 'Use your calm state for focused work'
            }),
            description: 'Channel your calm into productivity'
          }
        ];
      
      default:
        return [];
    }
  };

  const actions = getActionsForModule();

  if (actions.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-medium text-muted-foreground mb-3">
        What's Next?
      </h4>
      <div className="grid gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={action.action}
            className="flex items-center gap-2 justify-start h-auto p-3"
          >
            <div className="flex items-center gap-2 flex-1">
              {action.icon}
              <div className="text-left">
                <div className="font-medium text-sm">{action.label}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </div>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CrossModuleActions;
