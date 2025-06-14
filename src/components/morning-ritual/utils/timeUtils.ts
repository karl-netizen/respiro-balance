
export const formatTimeDisplay = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export const getTimeDifferenceInMinutes = (startTime: string, endTime: string): number => {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  return Math.abs(end.getTime() - start.getTime()) / (1000 * 60);
};

export const getRitualTimeFromPreferences = (preferences: any): string => {
  return preferences?.wakeTime || '07:00';
};
