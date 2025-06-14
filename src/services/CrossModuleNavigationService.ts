
import { NavigateFunction } from 'react-router-dom';
import { toast } from 'sonner';

export interface NavigationContext {
  sourceModule: string;
  sessionData?: any;
  userContext?: any;
  recommendationReason?: string;
}

export class CrossModuleNavigationService {
  private navigate: NavigateFunction | null = null;
  
  setNavigate(navigate: NavigateFunction) {
    this.navigate = navigate;
  }
  
  // Seamless transitions between modules with context preservation
  navigateWithContext(destination: string, context: NavigationContext) {
    if (!this.navigate) {
      console.error('Navigate function not set');
      return;
    }
    
    // Store context in session storage for cross-module access
    sessionStorage.setItem('navigationContext', JSON.stringify(context));
    
    // Add contextual parameters to the URL
    const url = new URL(destination, window.location.origin);
    url.searchParams.set('source', context.sourceModule);
    if (context.recommendationReason) {
      url.searchParams.set('reason', context.recommendationReason);
    }
    
    this.navigate(url.pathname + url.search);
    
    // Show transition message
    if (context.recommendationReason) {
      toast.success(`Suggested: ${context.recommendationReason}`, {
        description: `Transitioning from ${context.sourceModule}`
      });
    }
  }
  
  // Quick actions for common cross-module flows
  fromMeditationToProgress(sessionData: any) {
    this.navigateWithContext('/progress?tab=insights', {
      sourceModule: 'meditation',
      sessionData,
      recommendationReason: 'View your meditation insights'
    });
  }
  
  fromProgressToMeditation(recommendedSession: string) {
    this.navigateWithContext(`/meditation?session=${recommendedSession}`, {
      sourceModule: 'progress',
      recommendationReason: 'Try this recommended session'
    });
  }
  
  fromFocusToBreathing(stressLevel: number) {
    this.navigateWithContext('/breathing', {
      sourceModule: 'focus',
      userContext: { stressLevel },
      recommendationReason: 'Reduce stress with breathing exercises'
    });
  }
  
  fromBiofeedbackToMeditation(heartRateVariability: number) {
    const sessionType = heartRateVariability < 40 ? 'stress-relief' : 'focus';
    this.navigateWithContext(`/meditation?tab=guided&type=${sessionType}`, {
      sourceModule: 'biofeedback',
      userContext: { heartRateVariability },
      recommendationReason: `HRV suggests ${sessionType} meditation`
    });
  }
  
  // Get stored navigation context
  getNavigationContext(): NavigationContext | null {
    const context = sessionStorage.getItem('navigationContext');
    return context ? JSON.parse(context) : null;
  }
  
  // Clear navigation context
  clearNavigationContext() {
    sessionStorage.removeItem('navigationContext');
  }
}

export const crossModuleNavigation = new CrossModuleNavigationService();
