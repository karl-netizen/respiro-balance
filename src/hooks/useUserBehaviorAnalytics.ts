
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface BehaviorEvent {
  id: string;
  userId: string;
  event: string;
  timestamp: Date;
  sessionId: string;
  properties: Record<string, any>;
  context: {
    page: string;
    userAgent: string;
    referrer: string;
    viewport: { width: number; height: number };
  };
}

export interface UserSegment {
  id: string;
  name: string;
  conditions: Array<{
    property: string;
    operator: 'gt' | 'lt' | 'eq' | 'contains' | 'between';
    value: any;
  }>;
  actions: string[];
}

export interface ChurnRiskScore {
  score: number; // 0-100
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  factors: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  recommendations: string[];
}

export const useUserBehaviorAnalytics = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<BehaviorEvent[]>([]);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [churnRisk, setChurnRisk] = useState<ChurnRiskScore | null>(null);

  // User segments for targeted interventions
  const userSegments: UserSegment[] = [
    {
      id: 'power_users',
      name: 'Power Users',
      conditions: [
        { property: 'sessions_per_week', operator: 'gt', value: 5 },
        { property: 'avg_session_duration', operator: 'gt', value: 600 }
      ],
      actions: ['show_advanced_features', 'offer_premium_upgrade']
    },
    {
      id: 'at_risk',
      name: 'At Risk Users',
      conditions: [
        { property: 'days_since_last_session', operator: 'gt', value: 7 },
        { property: 'total_sessions', operator: 'gt', value: 3 }
      ],
      actions: ['send_winback_notification', 'offer_support']
    },
    {
      id: 'new_users',
      name: 'New Users',
      conditions: [
        { property: 'days_since_signup', operator: 'lt', value: 7 },
        { property: 'total_sessions', operator: 'lt', value: 3 }
      ],
      actions: ['show_onboarding_tips', 'encourage_first_session']
    }
  ];

  // Track user behavior event
  const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
    if (!user) return;

    const event: BehaviorEvent = {
      id: Math.random().toString(36).substring(7),
      userId: user.id,
      event: eventName,
      timestamp: new Date(),
      sessionId,
      properties,
      context: {
        page: window.location.pathname,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    };

    setEvents(prev => [...prev, event]);
    
    // Send to analytics service (mock)
    console.log('Behavior tracked:', eventName, properties);
  };

  // Calculate churn risk score
  const calculateChurnRisk = (userEvents: BehaviorEvent[]): ChurnRiskScore => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentEvents = userEvents.filter(e => e.timestamp >= thirtyDaysAgo);
    const sessionEvents = recentEvents.filter(e => e.event === 'session_completed');
    const lastSession = sessionEvents[sessionEvents.length - 1];
    
    let score = 0;
    const factors = [];
    
    // Days since last session (0-40 points)
    const daysSinceLastSession = lastSession 
      ? Math.floor((now.getTime() - lastSession.timestamp.getTime()) / (24 * 60 * 60 * 1000))
      : 30;
    
    if (daysSinceLastSession > 14) {
      score += 40;
      factors.push({
        factor: 'Days Since Last Session',
        impact: 40,
        description: `${daysSinceLastSession} days since last session`
      });
    } else if (daysSinceLastSession > 7) {
      score += 20;
      factors.push({
        factor: 'Days Since Last Session',
        impact: 20,
        description: `${daysSinceLastSession} days since last session`
      });
    }

    // Session frequency (0-30 points)
    const sessionsThisMonth = sessionEvents.length;
    if (sessionsThisMonth === 0) {
      score += 30;
      factors.push({
        factor: 'Session Frequency',
        impact: 30,
        description: 'No sessions this month'
      });
    } else if (sessionsThisMonth < 4) {
      score += 15;
      factors.push({
        factor: 'Session Frequency',
        impact: 15,
        description: `Only ${sessionsThisMonth} sessions this month`
      });
    }

    // Engagement trend (0-20 points)
    const firstHalf = recentEvents.filter(e => 
      e.timestamp >= thirtyDaysAgo && 
      e.timestamp <= new Date(thirtyDaysAgo.getTime() + 15 * 24 * 60 * 60 * 1000)
    );
    const secondHalf = recentEvents.filter(e => 
      e.timestamp > new Date(thirtyDaysAgo.getTime() + 15 * 24 * 60 * 60 * 1000)
    );
    
    if (secondHalf.length < firstHalf.length * 0.5) {
      score += 20;
      factors.push({
        factor: 'Engagement Trend',
        impact: 20,
        description: 'Declining engagement over time'
      });
    }

    // Feature usage (0-10 points)
    const uniqueEvents = new Set(recentEvents.map(e => e.event));
    if (uniqueEvents.size < 3) {
      score += 10;
      factors.push({
        factor: 'Feature Usage',
        impact: 10,
        description: 'Limited feature exploration'
      });
    }

    // Determine risk level and recommendations
    let risk_level: ChurnRiskScore['risk_level'];
    let recommendations: string[] = [];

    if (score >= 75) {
      risk_level = 'critical';
      recommendations = [
        'Send immediate retention campaign',
        'Offer personal support call',
        'Provide special discount or incentive',
        'Simplify onboarding experience'
      ];
    } else if (score >= 50) {
      risk_level = 'high';
      recommendations = [
        'Send re-engagement email series',
        'Offer guided meditation sessions',
        'Highlight unused features',
        'Provide usage tips and motivation'
      ];
    } else if (score >= 25) {
      risk_level = 'medium';
      recommendations = [
        'Send gentle reminder notifications',
        'Suggest new content based on preferences',
        'Encourage goal setting',
        'Share success stories'
      ];
    } else {
      risk_level = 'low';
      recommendations = [
        'Continue current engagement',
        'Introduce advanced features',
        'Collect feedback for improvements'
      ];
    }

    return {
      score,
      risk_level,
      factors,
      recommendations
    };
  };

  // Get user analytics summary
  const getAnalyticsSummary = () => {
    const userEvents = events.filter(e => e.userId === user?.id);
    const totalEvents = userEvents.length;
    const uniqueEvents = new Set(userEvents.map(e => e.event)).size;
    const averageEventsPerSession = totalEvents / new Set(userEvents.map(e => e.sessionId)).size || 0;
    
    const sessionEvents = userEvents.filter(e => e.event === 'session_completed');
    const totalSessions = sessionEvents.length;
    const averageDuration = sessionEvents.reduce((sum, e) => sum + (e.properties.duration || 0), 0) / totalSessions || 0;

    return {
      totalEvents,
      uniqueEvents,
      averageEventsPerSession,
      totalSessions,
      averageDuration,
      churnRisk: churnRisk?.score || 0,
      riskLevel: churnRisk?.risk_level || 'low'
    };
  };

  // Update churn risk periodically
  useEffect(() => {
    if (user && events.length > 0) {
      const userEvents = events.filter(e => e.userId === user.id);
      const risk = calculateChurnRisk(userEvents);
      setChurnRisk(risk);
    }
  }, [events, user]);

  // Auto-track page views
  useEffect(() => {
    trackEvent('page_view', {
      path: window.location.pathname
    });
  }, [window.location.pathname]);

  return {
    trackEvent,
    churnRisk,
    getAnalyticsSummary,
    userSegments,
    events: events.filter(e => e.userId === user?.id)
  };
};
