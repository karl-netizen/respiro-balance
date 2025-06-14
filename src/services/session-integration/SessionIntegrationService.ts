
import { unifiedDataCoordinator } from '../UnifiedDataCoordinator';
import { unifiedAchievementSystem } from '../unified-achievement/UnifiedAchievementSystem';
import { intelligentNotificationSystem } from '../intelligent-notifications/IntelligentNotificationSystem';

export interface SessionFlow {
  id: string;
  userId: string;
  modules: string[];
  currentModule: string;
  currentStep: number;
  totalSteps: number;
  context: SessionFlowContext;
  startedAt: Date;
  estimatedDuration: number;
}

export interface SessionFlowContext {
  biometricBaseline?: any;
  userGoal?: string;
  previousSessions?: any[];
  timeConstraints?: any;
  socialContext?: any;
}

export interface SessionTransition {
  fromModule: string;
  toModule: string;
  trigger: string;
  data: any;
  preserveContext: boolean;
}

export class SessionIntegrationService {
  private static instance: SessionIntegrationService;
  private activeSessions: Map<string, SessionFlow> = new Map();
  private sessionHistory: Map<string, SessionFlow[]> = new Map();

  private constructor() {}

  public static getInstance(): SessionIntegrationService {
    if (!SessionIntegrationService.instance) {
      SessionIntegrationService.instance = new SessionIntegrationService();
    }
    return SessionIntegrationService.instance;
  }

  // Start integrated session flow
  async startSessionFlow(userId: string, modules: string[], context: SessionFlowContext): Promise<SessionFlow> {
    const sessionFlow: SessionFlow = {
      id: this.generateId(),
      userId,
      modules,
      currentModule: modules[0],
      currentStep: 0,
      totalSteps: modules.length,
      context,
      startedAt: new Date(),
      estimatedDuration: this.calculateEstimatedDuration(modules)
    };

    this.activeSessions.set(sessionFlow.id, sessionFlow);
    
    // Initialize first module with context
    await this.initializeModuleWithContext(sessionFlow.currentModule, context);
    
    return sessionFlow;
  }

  // Handle seamless transitions between modules
  async handleSessionTransition(sessionId: string, transition: SessionTransition): Promise<void> {
    const sessionFlow = this.activeSessions.get(sessionId);
    if (!sessionFlow) return;

    try {
      // Complete current module
      await this.completeModuleSession(sessionFlow, transition.fromModule, transition.data);
      
      // Move to next module
      sessionFlow.currentStep++;
      sessionFlow.currentModule = transition.toModule;
      
      // Preserve context if needed
      if (transition.preserveContext) {
        await this.transferContextBetweenModules(sessionFlow, transition);
      }
      
      // Initialize next module
      await this.initializeModuleWithContext(transition.toModule, sessionFlow.context);
      
      // Update session flow
      this.activeSessions.set(sessionId, sessionFlow);
      
      // Send transition notification
      await intelligentNotificationSystem.scheduleContextualNotification({
        id: this.generateId(),
        type: 'suggestion',
        module: transition.toModule,
        title: 'Session Flow Continues',
        message: `Great progress! Moving to ${transition.toModule} session.`,
        priority: 'medium',
        timing: 'immediate',
        context: sessionFlow.context
      });
      
    } catch (error) {
      console.error('Error handling session transition:', error);
    }
  }

  // Complete entire session flow
  async completeSessionFlow(sessionId: string, outcomes: any): Promise<void> {
    const sessionFlow = this.activeSessions.get(sessionId);
    if (!sessionFlow) return;

    try {
      // Process cross-module outcomes
      const unifiedOutcomes = await this.calculateUnifiedOutcomes(sessionFlow, outcomes);
      
      // Update unified data coordinator
      await unifiedDataCoordinator.onSessionComplete({
        id: sessionId,
        userId: sessionFlow.userId,
        type: 'integrated_flow' as any,
        duration: Math.floor((Date.now() - sessionFlow.startedAt.getTime()) / 60000),
        completedAt: new Date(),
        outcomes: unifiedOutcomes
      });
      
      // Check for cross-module achievements
      const achievements = await unifiedAchievementSystem.checkAllAchievements(sessionFlow.userId, {
        userId: sessionFlow.userId,
        module: 'integrated',
        activityType: 'session_flow_complete',
        data: { modules: sessionFlow.modules, outcomes: unifiedOutcomes },
        timestamp: new Date()
      });
      
      // Archive session
      this.archiveSession(sessionFlow);
      this.activeSessions.delete(sessionId);
      
      // Generate post-session recommendations
      await this.generatePostSessionRecommendations(sessionFlow, unifiedOutcomes);
      
    } catch (error) {
      console.error('Error completing session flow:', error);
    }
  }

  // Smart session recommendations based on context
  async generateSessionRecommendations(userId: string, context: any): Promise<string[]> {
    const recommendations: string[] = [];
    
    // Analyze user's recent activity
    const recentSessions = this.getRecentSessions(userId);
    const biometricState = context.biometricData;
    const timeOfDay = new Date().getHours();
    
    // Morning recommendations
    if (timeOfDay < 10) {
      recommendations.push('morning-ritual');
      if (biometricState?.stressLevel > 60) {
        recommendations.push('breathing', 'meditation');
      } else {
        recommendations.push('meditation', 'focus');
      }
    }
    // Afternoon recommendations
    else if (timeOfDay < 17) {
      if (biometricState?.stressLevel > 70) {
        recommendations.push('breathing', 'meditation');
      } else {
        recommendations.push('focus', 'breathing');
      }
    }
    // Evening recommendations
    else {
      recommendations.push('meditation', 'breathing');
    }
    
    return recommendations.slice(0, 3); // Limit to 3 recommendations
  }

  private async initializeModuleWithContext(module: string, context: SessionFlowContext): Promise<void> {
    // Set up module-specific context
    sessionStorage.setItem(`${module}_context`, JSON.stringify(context));
  }

  private async completeModuleSession(sessionFlow: SessionFlow, module: string, data: any): Promise<void> {
    // Record module completion data
    const moduleSession = {
      module,
      data,
      completedAt: new Date(),
      duration: data.duration || 0
    };
    
    // Update session flow context with outcomes
    sessionFlow.context = {
      ...sessionFlow.context,
      previousSessions: [...(sessionFlow.context.previousSessions || []), moduleSession]
    };
  }

  private async transferContextBetweenModules(sessionFlow: SessionFlow, transition: SessionTransition): Promise<void> {
    // Transfer relevant data between modules
    const fromContext = JSON.parse(sessionStorage.getItem(`${transition.fromModule}_context`) || '{}');
    const sharedContext = {
      ...sessionFlow.context,
      biometricData: transition.data.biometrics,
      previousModuleOutcome: transition.data.outcome
    };
    
    sessionStorage.setItem(`${transition.toModule}_context`, JSON.stringify(sharedContext));
  }

  private async calculateUnifiedOutcomes(sessionFlow: SessionFlow, outcomes: any): Promise<any> {
    // Combine outcomes from all modules in the flow
    const allSessions = sessionFlow.context.previousSessions || [];
    
    return {
      totalDuration: allSessions.reduce((sum, session) => sum + (session.duration || 0), 0),
      modulesCompleted: sessionFlow.modules.length,
      stressReduction: outcomes.stressReduction || 0,
      focusImprovement: outcomes.focusImprovement || 0,
      satisfactionScore: outcomes.satisfactionScore || 5,
      techniques: sessionFlow.modules
    };
  }

  private async generatePostSessionRecommendations(sessionFlow: SessionFlow, outcomes: any): Promise<void> {
    // Generate intelligent next-session recommendations
    let nextRecommendation = '';
    
    if (outcomes.stressReduction > 0.3) {
      nextRecommendation = 'Your stress levels improved significantly. Consider a focus session to maximize productivity!';
    } else if (outcomes.focusImprovement > 0.2) {
      nextRecommendation = 'Great focus improvement! This would be perfect timing for important work.';
    }
    
    if (nextRecommendation) {
      await intelligentNotificationSystem.scheduleContextualNotification({
        id: this.generateId(),
        type: 'suggestion',
        module: 'general',
        title: 'Session Complete - What\'s Next?',
        message: nextRecommendation,
        priority: 'medium',
        timing: 'immediate',
        context: outcomes
      });
    }
  }

  private calculateEstimatedDuration(modules: string[]): number {
    // Estimate total duration based on modules
    const durations = {
      'morning-ritual': 10,
      'meditation': 15,
      'breathing': 5,
      'focus': 25
    };
    
    return modules.reduce((total, module) => total + (durations[module as keyof typeof durations] || 10), 0);
  }

  private archiveSession(sessionFlow: SessionFlow): void {
    const userSessions = this.sessionHistory.get(sessionFlow.userId) || [];
    userSessions.push(sessionFlow);
    this.sessionHistory.set(sessionFlow.userId, userSessions);
  }

  private getRecentSessions(userId: string): SessionFlow[] {
    const sessions = this.sessionHistory.get(userId) || [];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return sessions.filter(session => session.startedAt > sevenDaysAgo);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Public getters
  getActiveSession(userId: string): SessionFlow | undefined {
    return Array.from(this.activeSessions.values()).find(session => session.userId === userId);
  }

  getSessionHistory(userId: string): SessionFlow[] {
    return this.sessionHistory.get(userId) || [];
  }
}

export const sessionIntegrationService = SessionIntegrationService.getInstance();
