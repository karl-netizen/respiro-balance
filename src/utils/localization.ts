
export type MeasurementSystem = 'metric' | 'imperial';

export interface ConversionUtils {
  temperature: (value: number, from: MeasurementSystem, to: MeasurementSystem) => number;
  distance: (value: number, from: MeasurementSystem, to: MeasurementSystem) => number;
  weight: (value: number, from: MeasurementSystem, to: MeasurementSystem) => number;
}

export const conversions: ConversionUtils = {
  temperature: (value: number, from: MeasurementSystem, to: MeasurementSystem): number => {
    if (from === to) return value;
    
    if (from === 'metric' && to === 'imperial') {
      return Math.round((value * 9/5) + 32);
    } else if (from === 'imperial' && to === 'metric') {
      return Math.round((value - 32) * 5/9);
    }
    
    return value;
  },

  distance: (value: number, from: MeasurementSystem, to: MeasurementSystem): number => {
    if (from === to) return value;
    
    if (from === 'metric' && to === 'imperial') {
      return Math.round(value * 0.621371 * 100) / 100; // km to miles
    } else if (from === 'imperial' && to === 'metric') {
      return Math.round(value * 1.60934 * 100) / 100; // miles to km
    }
    
    return value;
  },

  weight: (value: number, from: MeasurementSystem, to: MeasurementSystem): number => {
    if (from === to) return value;
    
    if (from === 'metric' && to === 'imperial') {
      return Math.round(value * 2.20462 * 100) / 100; // kg to lbs
    } else if (from === 'imperial' && to === 'metric') {
      return Math.round(value * 0.453592 * 100) / 100; // lbs to kg
    }
    
    return value;
  }
};

export const formatTemperature = (temp: number, system: MeasurementSystem): string => {
  const unit = system === 'imperial' ? '°F' : '°C';
  return `${temp}${unit}`;
};

export const formatDistance = (distance: number, system: MeasurementSystem): string => {
  const unit = system === 'imperial' ? 'mi' : 'km';
  return `${distance} ${unit}`;
};

export const formatWeight = (weight: number, system: MeasurementSystem): string => {
  const unit = system === 'imperial' ? 'lbs' : 'kg';
  return `${weight} ${unit}`;
};

export const formatDateTime = (date: Date, timezone?: string, locale: string = 'en-US'): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone
  };
  
  return new Intl.DateTimeFormat(locale, options).format(date);
};

export const formatTime = (date: Date, timezone?: string, locale: string = 'en-US'): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone
  };
  
  return new Intl.DateTimeFormat(locale, options).format(date);
};

export const getCountryFromTimezone = (timezone: string): string => {
  // Basic mapping of timezones to countries
  const timezoneCountryMap: { [key: string]: string } = {
    'America/New_York': 'US',
    'America/Los_Angeles': 'US',
    'America/Chicago': 'US',
    'America/Toronto': 'CA',
    'Europe/London': 'GB',
    'Europe/Paris': 'FR',
    'Europe/Berlin': 'DE',
    'Asia/Tokyo': 'JP',
    'Australia/Sydney': 'AU',
    'Asia/Kolkata': 'IN'
  };
  
  return timezoneCountryMap[timezone] || timezone.split('/')[0];
};
