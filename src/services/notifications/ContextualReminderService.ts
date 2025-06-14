
import { MorningRitual } from "@/context/types";
import { notificationService } from "../NotificationService";
import { RitualRiskAssessment } from "./RiskAssessmentEngine";

export interface ContextualData {
  weather?: {
    condition: string;
    temperature: number;
  };
  calendar?: any[];
  location?: string;
}

export class ContextualReminderService {
  // Contextual reminder delivery
  async sendContextualReminder(ritual: MorningRitual, riskAssessment: RitualRiskAssessment) {
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

  async sendEmergencyIntervention(ritual: MorningRitual, riskAssessment: RitualRiskAssessment) {
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
  private async gatherContextualData(): Promise<ContextualData> {
    return {
      weather: {
        condition: Math.random() > 0.7 ? 'rainy' : Math.random() > 0.5 ? 'sunny' : 'cloudy',
        temperature: Math.floor(Math.random() * 30) + 50
      },
      calendar: [], // Would integrate with calendar API
      location: 'home' // Would use geolocation
    };
  }
}

export const contextualReminderService = new ContextualReminderService();
