
import { MorningRitual } from "@/context/types";
import { riskAssessmentEngine, RitualRiskAssessment } from "./notifications/RiskAssessmentEngine";
import { adaptiveTimingEngine, AdaptiveReminder } from "./notifications/AdaptiveTimingEngine";
import { reminderScheduler } from "./notifications/ReminderScheduler";

export class SmartNotificationSystem {
  private riskAssessments: Map<string, RitualRiskAssessment> = new Map();
  private adaptiveReminders: Map<string, AdaptiveReminder> = new Map();

  // Contextual reminder system
  async scheduleContextualReminders(rituals: MorningRitual[]) {
    for (const ritual of rituals) {
      const riskAssessment = riskAssessmentEngine.assessRitualRisk(ritual);
      const adaptiveReminder = adaptiveTimingEngine.calculateOptimalTiming(ritual);
      
      this.riskAssessments.set(ritual.id, riskAssessment);
      this.adaptiveReminders.set(ritual.id, adaptiveReminder);
      
      await reminderScheduler.scheduleSmartReminder(ritual, riskAssessment, adaptiveReminder);
    }
  }

  // Cleanup
  clearAllReminders() {
    reminderScheduler.clearAllReminders();
  }

  clearReminder(ritualId: string) {
    reminderScheduler.clearReminder(ritualId);
  }

  getRiskAssessment(ritualId: string): RitualRiskAssessment | undefined {
    return this.riskAssessments.get(ritualId);
  }

  getAdaptiveReminder(ritualId: string): AdaptiveReminder | undefined {
    return this.adaptiveReminders.get(ritualId);
  }
}

export const smartNotificationSystem = new SmartNotificationSystem();
