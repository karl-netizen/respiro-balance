
import { MorningRitual } from '@/context/types';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const generateRitualId = generateId;

// Date and time utilities
export const wasCompletedToday = (ritual: MorningRitual): boolean => {
  if (!ritual.lastCompleted) return false;
  const today = new Date().toDateString();
  const completedDate = new Date(ritual.lastCompleted).toDateString();
  return today === completedDate;
};

export const shouldDoRitualToday = (ritual: MorningRitual): boolean => {
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayName = dayNames[today];
  
  if (ritual.recurrence === 'daily') return true;
  if (ritual.recurrence === 'weekdays') return today >= 1 && today <= 5;
  if (ritual.recurrence === 'weekends') return today === 0 || today === 6;
  if (ritual.recurrence === 'custom' && ritual.daysOfWeek) {
    return ritual.daysOfWeek.includes(todayName);
  }
  
  return false;
};

export const formatTimeDisplay = (time: string): string => {
  try {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  } catch {
    return time;
  }
};

// Status management
export const updateRitualStatuses = (rituals: MorningRitual[]): MorningRitual[] => {
  return rituals.map(ritual => ({
    ...ritual,
    status: wasCompletedToday(ritual) ? 'completed' : 
            shouldDoRitualToday(ritual) ? 'planned' : 'skipped'
  }));
};

// Biometric utilities (placeholder for now)
export const calculateBiometricChange = (before: any, after: any): number => {
  // Simplified calculation - would integrate with actual biometric data
  return Math.floor(Math.random() * 20) - 10; // -10 to +10 change
};

export const getBiometricDataFromDevices = async (): Promise<any> => {
  // Placeholder for device integration
  return {
    heartRate: 70 + Math.floor(Math.random() * 20),
    stressLevel: Math.floor(Math.random() * 100),
    timestamp: new Date()
  };
};
