
import { MorningRitual } from "@/context/types";

export interface RitualRiskAssessment {
  ritualId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  interventions: string[];
  confidence: number;
}

export class RiskAssessmentEngine {
  // Risk detection and pattern analysis
  assessRitualRisk(ritual: MorningRitual): RitualRiskAssessment {
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
}

export const riskAssessmentEngine = new RiskAssessmentEngine();
