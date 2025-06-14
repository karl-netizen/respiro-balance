
import { MorningRitual } from "@/context/types";
import { RitualRiskAssessment } from "./RiskAssessmentEngine";
import { AdaptiveReminder } from "./AdaptiveTimingEngine";
import { contextualReminderService } from "./ContextualReminderService";

export class ReminderScheduler {
  private notificationTimers: Map<string, number> = new Map();

  // Smart reminder scheduling
  async scheduleSmartReminder(
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
        await contextualReminderService.sendContextualReminder(ritual, riskAssessment);
      }, timeUntilReminder);
      
      this.notificationTimers.set(ritual.id, timerId);
    }
    
    // Schedule emergency intervention if high risk
    if (riskAssessment.riskLevel === 'high' || riskAssessment.riskLevel === 'critical') {
      this.scheduleEmergencyIntervention(ritual, riskAssessment);
    }
  }

  // Emergency intervention scheduling
  private scheduleEmergencyIntervention(ritual: MorningRitual, riskAssessment: RitualRiskAssessment) {
    const [hours, minutes] = ritual.timeOfDay.split(':').map(Number);
    const interventionTime = new Date();
    interventionTime.setHours(hours + 1, minutes, 0, 0); // 1 hour after planned time
    
    if (interventionTime > new Date()) {
      const timeUntilIntervention = interventionTime.getTime() - Date.now();
      
      setTimeout(async () => {
        await contextualReminderService.sendEmergencyIntervention(ritual, riskAssessment);
      }, timeUntilIntervention);
    }
  }

  // Cleanup
  clearAllReminders() {
    this.notificationTimers.forEach(timerId => clearTimeout(timerId));
    this.notificationTimers.clear();
  }

  clearReminder(ritualId: string) {
    const timerId = this.notificationTimers.get(ritualId);
    if (timerId) {
      clearTimeout(timerId);
      this.notificationTimers.delete(ritualId);
    }
  }
}

export const reminderScheduler = new ReminderScheduler();
