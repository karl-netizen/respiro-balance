
import { MorningRitual } from "@/context/types";
import { notificationService } from "./NotificationService";
import { contextAnalysisEngine } from "./context-analysis/ContextAnalysisEngine";

interface RitualRiskAssessment {
  ritualId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  interventions: string[];
  confidence: number;
}

interface AdaptiveReminder {
  ritualId: string;
  optimalTime: string;
  confidence: number;
  reasoning: string[];
}

export class SmartNotificationSystem {
  private riskAssessments: Map<string, RitualRiskAssessment> = new Map();
  private adaptiveReminders: Map<string, AdaptiveReminder> = new Map();
  private notificationTimers: Map<string, number> = new Map();

  // Contextual reminder system
  async scheduleContextualReminders(rituals: MorningRitual[]) {
    for (const ritual of rituals) {
      const riskAssessment = this.assessRitualRisk(ritual);
      const adaptiveReminder = this.calculateOptimalTiming(ritual);
      
      this.riskAssessments.set(ritual.id, riskAssessment);
      this.adaptiveReminders.set(ritual.id, adaptiveReminder);
      
      await this.scheduleSmartReminder(ritual, riskAssessment, adaptiveReminder);
    }
  }

  // Risk detection and pattern analysis
  private assessRitualRisk(ritual: MorningRitual): RitualRiskAssessment {
    const reasons: string[] = [];
    let riskScore = 0;
    
    // Analyze streak patterns
    if (ritual.streak < 3) {
      riskScore += 30;
      reasons.push('Low streak indicates unstable habit formation');
    }
    
    // Check recent completion patterns
    const daysSinceLastCompleted = ritual.lastCompleted 
      ? Math.floor((Date.now() - new Date(ritual.lastCompleted).getTime()) / (1000 * 60 * 60 * 24))
      : 7;
    
    if (daysSinceLastCompleted > 1) {
      riskScore += daysSinceLastCompleted * 15;
      reasons.push(`${daysSinceLastCompleted} days since last completion`);
    }
    
    // Analyze timing conflicts
    const currentHour = new Date().getHours();
    const [ritualHour] = ritual.timeOfDay.split(':').map(Number);
    
    if (Math.abs(currentHour - ritualHour) > 2) {
      riskScore += 20;
      reasons.push('Timing misalignment with current schedule');
    }
    
    // Weekend vs weekday patterns
    const isWeekend = [0, 6].includes(new Date().getDay());
    if (isWeekend && ritual.priority === 'high') {
      riskScore += 15;
      reasons.push('Weekend schedule disruption for high-priority ritual');
    }
    
    const riskLevel = riskScore > 60 ? 'critical' : 
                     riskScore > 40 ? 'high' : 
                     riskScore > 20 ? 'medium' : 'low';
    
    const interventions = this.generateInterventions(riskLevel, ritual);
    
    return {
      ritualId: ritual.id,
      riskLevel,
      reasons,
      interventions,
      confidence: Math.min(95, 60 + (reasons.length * 10))
    };
  }

  // Machine learning-based optimal timing
  private calculateOptimalTiming(ritual: MorningRitual): AdaptiveReminder {
    const reasoning: string[] = [];
    const baseTime = ritual.timeOfDay;
    const [hours, minutes] = baseTime.split(':').map(Number);
    
    // Analyze historical completion patterns (simulated ML)
    const currentHour = new Date().getHours();
    const isEarlyMorning = currentHour < 8;
    const isRushedMorning = currentHour >= 7 && currentHour <= 9;
    
    let optimalHours = hours;
    let optimalMinutes = minutes;
    let confidence = 70;
    
    if (isEarlyMorning && hours > 8) {
      optimalHours = Math.max(6, hours - 1);
      reasoning.push('Early morning optimization for better consistency');
      confidence += 15;
    }
    
    if (isRushedMorning && ritual.duration > 15) {
      optimalHours = Math.max(6, hours - 1);
      reasoning.push('Earlier timing to avoid rush hour conflicts');
      confidence += 10;
    }
    
    // Weekend adjustments
    const isWeekend = [0, 6].includes(new Date().getDay());
    if (isWeekend) {
      optimalHours = Math.min(10, hours + 1);
      reasoning.push('Weekend relaxed timing adjustment');
      confidence += 5;
    }
    
    const optimalTime = `${optimalHours.toString().padStart(2, '0')}:${optimalMinutes.toString().padStart(2, '0')}`;
    
    return {
      ritualId: ritual.id,
      optimalTime,
      confidence,
      reasoning
    };
  }

  // Emergency intervention system
  private generateInterventions(riskLevel: string, ritual: MorningRitual): string[] {
    const interventions: string[] = [];
    
    switch (riskLevel) {
      case 'critical':
        interventions.push('Immediate simplified 2-minute version');
        interventions.push('Emergency streak protection notification');
        interventions.push('Accountability partner alert');
        break;
      case 'high':
        interventions.push('Reduced duration option (50% of normal)');
        interventions.push('Alternative location suggestion');
        interventions.push('Motivational reminder with streak emphasis');
        break;
      case 'medium':
        interventions.push('Gentle reminder with flexibility options');
        interventions.push('Quick win alternative suggested');
        break;
      case 'low':
        interventions.push('Standard reminder with encouragement');
        break;
    }
    
    return interventions;
  }

  // Smart reminder scheduling
  private async scheduleSmartReminder(
    ritual: MorningRitual, 
    riskAssessment: RitualRiskAssessment, 
    adaptiveReminder: AdaptiveReminder
  ) {
    const [hours, minutes] = adaptiveReminder.optimalTime.split(':').map(Number);
    const reminderTime = new Date();
    reminderTime.setHours(hours - 1, minutes, 0, 0); // 1 hour before optimal time
    
    if (reminderTime > new Date()) {
      const timeUntilReminder = reminderTime.getTime() - Date.now();
      
      const timerId = window.setTimeout(async () => {
        await this.sendContextualReminder(ritual, riskAssessment);
      }, timeUntilReminder);
      
      this.notificationTimers.set(ritual.id, timerId);
    }
    
    // Schedule emergency intervention if high risk
    if (riskAssessment.riskLevel === 'high' || riskAssessment.riskLevel === 'critical') {
      this.scheduleEmergencyIntervention(ritual, riskAssessment);
    }
  }

  // Contextual reminder delivery
  private async sendContextualReminder(ritual: MorningRitual, riskAssessment: RitualRiskAssessment) {
    const context = await this.gatherContextualData();
    let message = `Time for your ${ritual.title} ritual`;
    
    // Weather-aware messaging
    if (context.weather?.condition === 'rainy') {
      message += '. Perfect indoor weather for mindful practice';
    } else if (context.weather?.condition === 'sunny') {
      message += '. Beautiful day to start with intention';
    }
    
    // Risk-aware messaging
    if (riskAssessment.riskLevel === 'high') {
      message += '. Your streak is valuable - just 5 minutes counts!';
    } else if (riskAssessment.riskLevel === 'critical') {
      message += '. Emergency: Any effort counts to maintain your progress!';
    }
    
    await notificationService.showNotification(
      `Morning Ritual Reminder`,
      message,
      {
        icon: '🌅',
        tag: `ritual-${ritual.id}`,
        data: { ritualId: ritual.id, riskLevel: riskAssessment.riskLevel }
      }
    );
  }

  // Emergency intervention scheduling
  private scheduleEmergencyIntervention(ritual: MorningRitual, riskAssessment: RitualRiskAssessment) {
    const [hours, minutes] = ritual.timeOfDay.split(':').map(Number);
    const interventionTime = new Date();
    interventionTime.setHours(hours + 1, minutes, 0, 0); // 1 hour after planned time
    
    if (interventionTime > new Date()) {
      const timeUntilIntervention = interventionTime.getTime() - Date.now();
      
      setTimeout(async () => {
        await this.sendEmergencyIntervention(ritual, riskAssessment);
      }, timeUntilIntervention);
    }
  }

  private async sendEmergencyIntervention(ritual: MorningRitual, riskAssessment: RitualRiskAssessment) {
    const intervention = riskAssessment.interventions[0] || 'Quick 2-minute version available';
    
    await notificationService.showNotification(
      '🚨 Streak Protection Active',
      `${ritual.title}: ${intervention}. Your ${ritual.streak}-day streak is worth protecting!`,
      {
        tag: `emergency-${ritual.id}`,
        requireInteraction: true,
        data: { ritualId: ritual.id, type: 'emergency' }
      }
    );
  }

  // Context gathering (simplified implementation)
  private async gatherContextualData() {
    return {
      weather: {
        condition: Math.random() > 0.7 ? 'rainy' : Math.random() > 0.5 ? 'sunny' : 'cloudy',
        temperature: Math.floor(Math.random() * 30) + 50
      },
      calendar: [], // Would integrate with calendar API
      location: 'home' // Would use geolocation
    };
  }

  // Cleanup
  clearAllReminders() {
    this.notificationTimers.forEach(timerId => clearTimeout(timerId));
    this.notificationTimers.clear();
  }

  getRiskAssessment(ritualId: string): RitualRiskAssessment | undefined {
    return this.riskAssessments.get(ritualId);
  }

  getAdaptiveReminder(ritualId: string): AdaptiveReminder | undefined {
    return this.adaptiveReminders.get(ritualId);
  }
}

export const smartNotificationSystem = new SmartNotificationSystem();
