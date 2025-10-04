/**
 * Health Data Service - Mock Implementation
 * In production: Integrate with Apple Health / Google Fit APIs
 */

import { HealthDataPoint, BiofeedbackMetrics } from './types';

class HealthDataService {
  private syncInterval: NodeJS.Timeout | null = null;
  private lastSyncTime: Date | null = null;

  /**
   * Check if health data access is available
   * In production: Check for iOS/Android native bridge
   * For now: Return true for demo purposes
   */
  async isHealthDataAvailable(): Promise<boolean> {
    return true;
  }

  /**
   * Request permission to read health data
   */
  async requestPermission(): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate permission dialog
      setTimeout(() => {
        localStorage.setItem('health_permission_granted', 'true');
        resolve(true);
      }, 500);
    });
  }

  /**
   * Check if we have permission
   */
  hasPermission(): boolean {
    return localStorage.getItem('health_permission_granted') === 'true';
  }

  /**
   * Fetch latest health metrics
   * In production: Query Apple Health / Google Fit
   * For demo: Generate realistic mock data with trends
   */
  async fetchLatestMetrics(): Promise<BiofeedbackMetrics> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate realistic mock data with gradual improvements
    const baselineHR = 68;
    const baselineHRV = 45;
    
    // Add some variance and slight improvement trend over time
    const daysSinceStart = Math.floor(
      (Date.now() - new Date('2025-01-01').getTime()) / (1000 * 60 * 60 * 24)
    );
    const improvementFactor = Math.min(daysSinceStart * 0.02, 5);

    const currentHR = baselineHR - improvementFactor + (Math.random() * 4 - 2);
    const currentHRV = baselineHRV + improvementFactor + (Math.random() * 6 - 3);

    const restingHeartRate: HealthDataPoint = {
      id: `hr-${Date.now()}`,
      timestamp: new Date(),
      value: Math.round(currentHR),
      unit: 'BPM',
      source: 'apple_health'
    };

    const heartRateVariability: HealthDataPoint = {
      id: `hrv-${Date.now()}`,
      timestamp: new Date(),
      value: Math.round(currentHRV),
      unit: 'ms',
      source: 'apple_health'
    };

    // Calculate stress score (simplified algorithm)
    // Lower HR + Higher HRV = Lower stress
    // Scale: 0-100 (0 = no stress, 100 = high stress)
    const hrStressFactor = Math.max(0, (currentHR - 60) * 2);
    const hrvStressFactor = Math.max(0, (60 - currentHRV) * 1.5);
    const stressScore = Math.min(100, Math.max(0, (hrStressFactor + hrvStressFactor) / 2));

    this.lastSyncTime = new Date();

    return {
      restingHeartRate,
      heartRateVariability,
      stressScore: Math.round(stressScore)
    };
  }

  /**
   * Start automatic background sync every 30 minutes
   */
  startAutoSync(callback: (metrics: BiofeedbackMetrics) => void) {
    if (this.syncInterval) {
      this.stopAutoSync();
    }

    // Initial sync
    this.fetchLatestMetrics().then(callback);

    // Sync every 30 minutes
    this.syncInterval = setInterval(() => {
      this.fetchLatestMetrics().then(callback);
    }, 30 * 60 * 1000); // 30 minutes
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  getLastSyncTime(): Date | null {
    return this.lastSyncTime;
  }
}

export const healthDataService = new HealthDataService();
