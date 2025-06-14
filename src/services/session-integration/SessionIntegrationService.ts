
export interface SessionFlow {
  id: string;
  userId: string;
  modules: string[];
  currentModule: string;
  context: any;
  startedAt: Date;
}

export interface SessionTransition {
  fromModule: string;
  toModule: string;
  trigger: 'user_choice' | 'biometric' | 'time_based' | 'ai_recommendation';
  data: any;
  preserveContext: boolean;
}

class SessionIntegrationServiceClass {
  private static instance: SessionIntegrationServiceClass;
  private activeSessions: Map<string, SessionFlow> = new Map();

  private constructor() {}

  public static getInstance(): SessionIntegrationServiceClass {
    if (!SessionIntegrationServiceClass.instance) {
      SessionIntegrationServiceClass.instance = new SessionIntegrationServiceClass();
    }
    return SessionIntegrationServiceClass.instance;
  }

  async startSessionFlow(userId: string, modules: string[], context: any): Promise<SessionFlow> {
    const sessionFlow: SessionFlow = {
      id: Math.random().toString(),
      userId,
      modules,
      currentModule: modules[0],
      context,
      startedAt: new Date()
    };

    this.activeSessions.set(userId, sessionFlow);
    return sessionFlow;
  }

  getActiveSession(userId: string): SessionFlow | null {
    return this.activeSessions.get(userId) || null;
  }

  async handleSessionTransition(sessionId: string, transition: SessionTransition): Promise<void> {
    console.log('Handling session transition:', sessionId, transition);
  }

  async completeSessionFlow(sessionId: string, outcomes: any): Promise<void> {
    // Find and remove the session
    for (const [userId, session] of this.activeSessions.entries()) {
      if (session.id === sessionId) {
        this.activeSessions.delete(userId);
        break;
      }
    }
  }

  async generateSessionRecommendations(userId: string, context: any): Promise<string[]> {
    return ['meditation', 'breathing', 'focus'];
  }
}

export const sessionIntegrationService = SessionIntegrationServiceClass.getInstance();
