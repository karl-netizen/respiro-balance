/**
 * Biofeedback Store - Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  BiofeedbackMetrics, 
  SessionInsight, 
  WeeklyReport 
} from '@/lib/biofeedback/types';
import { healthDataService } from '@/lib/biofeedback/healthDataService';

interface BiofeedbackState {
  isConnected: boolean;
  currentMetrics: BiofeedbackMetrics | null;
  lastSyncTime: Date | null;
  sessionInsights: SessionInsight[];
  weeklyReports: WeeklyReport[];
  
  // Actions
  connectHealthApp: () => Promise<boolean>;
  disconnectHealthApp: () => void;
  syncHealthData: () => Promise<void>;
  captureSessionInsight: (
    sessionId: string, 
    sessionType: 'meditation' | 'breathing' | 'focus',
    duration: number
  ) => Promise<SessionInsight>;
  generateWeeklyReport: () => Promise<WeeklyReport>;
  getRecentInsights: (limit?: number) => SessionInsight[];
}

export const useBiofeedbackStore = create<BiofeedbackState>()(
  persist(
    (set, get) => ({
      isConnected: false,
      currentMetrics: null,
      lastSyncTime: null,
      sessionInsights: [],
      weeklyReports: [],

      connectHealthApp: async () => {
        const hasPermission = await healthDataService.requestPermission();
        
        if (hasPermission) {
          // Start auto-sync
          healthDataService.startAutoSync((metrics) => {
            set({ 
              currentMetrics: metrics,
              lastSyncTime: new Date(),
              isConnected: true
            });
          });
          
          return true;
        }
        
        return false;
      },

      disconnectHealthApp: () => {
        healthDataService.stopAutoSync();
        set({ 
          isConnected: false,
          currentMetrics: null 
        });
      },

      syncHealthData: async () => {
        const metrics = await healthDataService.fetchLatestMetrics();
        set({ 
          currentMetrics: metrics,
          lastSyncTime: new Date()
        });
      },

      captureSessionInsight: async (sessionId, sessionType, duration) => {
        const { currentMetrics } = get();
        
        // Capture pre-session metrics
        const preMetrics = currentMetrics;
        
        // Simulate waiting for session to complete + 5 min recovery
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Fetch post-session metrics
        const postMetrics = await healthDataService.fetchLatestMetrics();
        
        // Calculate changes
        const hrChange = preMetrics?.restingHeartRate && postMetrics.restingHeartRate
          ? postMetrics.restingHeartRate.value - preMetrics.restingHeartRate.value
          : null;
          
        const hrvChange = preMetrics?.heartRateVariability && postMetrics.heartRateVariability
          ? ((postMetrics.heartRateVariability.value - preMetrics.heartRateVariability.value) / 
             preMetrics.heartRateVariability.value) * 100
          : null;
          
        const stressReduction = preMetrics?.stressScore !== null && 
                                postMetrics.stressScore !== null
          ? ((preMetrics.stressScore - postMetrics.stressScore) / preMetrics.stressScore) * 100
          : null;
        
        // Generate insight text
        const insightText = generateInsightText(hrChange, hrvChange, stressReduction, sessionType);
        const impactRating = calculateImpactRating(hrChange, hrvChange, stressReduction);
        
        const insight: SessionInsight = {
          sessionId,
          sessionType,
          duration,
          timestamp: new Date(),
          preSessionHR: preMetrics?.restingHeartRate?.value || null,
          preSessionHRV: preMetrics?.heartRateVariability?.value || null,
          preSessionStress: preMetrics?.stressScore || null,
          postSessionHR: postMetrics.restingHeartRate?.value || null,
          postSessionHRV: postMetrics.heartRateVariability?.value || null,
          postSessionStress: postMetrics.stressScore || null,
          hrChange,
          hrvChange,
          stressReduction,
          insightText,
          impactRating
        };
        
        set(state => ({
          sessionInsights: [insight, ...state.sessionInsights]
        }));
        
        return insight;
      },

      generateWeeklyReport: async () => {
        const { sessionInsights } = get();
        
        // Get last 7 days of insights
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const weekInsights = sessionInsights.filter(
          insight => new Date(insight.timestamp) >= weekAgo
        );
        
        if (weekInsights.length === 0) {
          throw new Error('Not enough data for weekly report');
        }
        
        // Calculate aggregates
        const totalSessions = weekInsights.length;
        const totalMinutes = weekInsights.reduce((sum, i) => sum + i.duration, 0);
        
        const avgHRChange = weekInsights
          .filter(i => i.hrChange !== null)
          .reduce((sum, i) => sum + (i.hrChange || 0), 0) / totalSessions;
          
        const avgHRVChange = weekInsights
          .filter(i => i.hrvChange !== null)
          .reduce((sum, i) => sum + (i.hrvChange || 0), 0) / totalSessions;
          
        const avgStressReduction = weekInsights
          .filter(i => i.stressReduction !== null)
          .reduce((sum, i) => sum + (i.stressReduction || 0), 0) / totalSessions;
        
        // Find best session
        const bestSession = weekInsights.reduce((best, current) => {
          const bestScore = (best.stressReduction || 0) + (best.hrvChange || 0);
          const currentScore = (current.stressReduction || 0) + (current.hrvChange || 0);
          return currentScore > bestScore ? current : best;
        });
        
        // Generate recommendations
        const recommendations = generateRecommendations(weekInsights);
        
        const report: WeeklyReport = {
          weekStartDate: weekAgo,
          weekEndDate: new Date(),
          totalSessions,
          totalMinutes,
          avgRestingHR: 65,
          avgHRV: 48,
          avgStressLevel: 25,
          restingHRChange: avgHRChange,
          hrvImprovement: avgHRVChange,
          stressReduction: avgStressReduction,
          bestSession,
          recommendations
        };
        
        set(state => ({
          weeklyReports: [report, ...state.weeklyReports]
        }));
        
        return report;
      },

      getRecentInsights: (limit = 5) => {
        return get().sessionInsights.slice(0, limit);
      }
    }),
    {
      name: 'respiro-biofeedback'
    }
  )
);

// Helper functions
function generateInsightText(
  hrChange: number | null,
  hrvChange: number | null,
  stressReduction: number | null,
  sessionType: string
): string {
  if (!hrChange && !hrvChange && !stressReduction) {
    return `Great ${sessionType} session! Keep building your practice.`;
  }
  
  const hrText = hrChange && hrChange < 0 
    ? `Your heart rate dropped ${Math.abs(Math.round(hrChange))} BPM` 
    : '';
    
  const stressText = stressReduction && stressReduction > 0
    ? `reducing stress by ${Math.round(stressReduction)}%`
    : '';
  
  if (hrText && stressText) {
    return `${hrText}, ${stressText}. Excellent progress! 🎉`;
  } else if (hrText) {
    return `${hrText} during this session. Keep it up! 💪`;
  } else if (stressText) {
    return `This session reduced your stress by ${Math.round(stressReduction || 0)}%. Well done! ✨`;
  }
  
  return `Solid session! Your practice is making a difference.`;
}

function calculateImpactRating(
  hrChange: number | null,
  hrvChange: number | null,
  stressReduction: number | null
): 'low' | 'moderate' | 'high' | 'excellent' {
  const score = 
    (hrChange && hrChange < 0 ? Math.abs(hrChange) * 2 : 0) +
    (hrvChange && hrvChange > 0 ? hrvChange * 3 : 0) +
    (stressReduction && stressReduction > 0 ? stressReduction * 2 : 0);
  
  if (score >= 50) return 'excellent';
  if (score >= 30) return 'high';
  if (score >= 15) return 'moderate';
  return 'low';
}

function generateRecommendations(insights: SessionInsight[]): string[] {
  const recommendations: string[] = [];
  
  // Analyze patterns
  const morningCount = insights.filter(i => {
    const hour = new Date(i.timestamp).getHours();
    return hour >= 6 && hour < 12;
  }).length;
  
  if (morningCount > insights.length * 0.6) {
    recommendations.push('Morning sessions work great for you! Keep this routine.');
  }
  
  const avgDuration = insights.reduce((sum, i) => sum + i.duration, 0) / insights.length;
  if (avgDuration < 10) {
    recommendations.push('Try extending sessions to 15 minutes for deeper benefits.');
  }
  
  const excellentSessions = insights.filter(i => i.impactRating === 'excellent').length;
  if (excellentSessions > 2) {
    recommendations.push('Your practice is showing excellent results! Stay consistent.');
  }
  
  return recommendations;
}
