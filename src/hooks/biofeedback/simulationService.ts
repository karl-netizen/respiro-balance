
import { BiometricData } from '@/components/meditation/types/BiometricTypes';

export class BiometricSimulationService {
  private intervalId: NodeJS.Timeout | null = null;
  private updateCallback: ((data: Partial<BiometricData>) => void) | null = null;

  /**
   * Start simulation of biometric data
   * @param callback Function to call with simulated data
   * @returns Cleanup function
   */
  startSimulation(callback: (data: Partial<BiometricData>) => void): () => void {
    this.updateCallback = callback;
    
    // Generate mock data immediately
    this.simulateData();
    
    // Set interval for ongoing simulation
    this.intervalId = setInterval(() => this.simulateData(), 2000);
    
    // Return cleanup function
    return () => this.stopSimulation();
  }

  /**
   * Stop simulation
   */
  stopSimulation(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.updateCallback = null;
  }

  /**
   * Generate simulated biometric data
   */
  private simulateData(): void {
    if (!this.updateCallback) return;
    
    const mockData: Partial<BiometricData> = {
      heart_rate: 60 + Math.floor(Math.random() * 20),
      hrv: 40 + Math.floor(Math.random() * 30),
      breath_rate: 12 + Math.floor(Math.random() * 6),
      stress_level: Math.floor(Math.random() * 100),
      focus_score: 60 + Math.floor(Math.random() * 40),
      brainwaves: {
        alpha: Math.random() * 10,
        beta: Math.random() * 20,
        delta: Math.random() * 5,
        gamma: Math.random() * 2,
        theta: Math.random() * 8
      }
    };
    
    this.updateCallback(mockData);
  }
}

// Create singleton instance
export const simulationService = new BiometricSimulationService();
