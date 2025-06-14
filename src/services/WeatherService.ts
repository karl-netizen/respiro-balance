
export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  description: string;
  temperatureUnit: '°C' | '°F';
  location?: string;
}

export class WeatherService {
  private static readonly CACHE_KEY = 'weather_data';
  private static readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  private static readonly API_KEY_PLACEHOLDER = 'YOUR_OPENWEATHERMAP_API_KEY';

  static async getCurrentWeather(
    lat?: number, 
    lon?: number, 
    city?: string,
    country?: string,
    units: 'metric' | 'imperial' = 'metric'
  ): Promise<WeatherData | null> {
    try {
      // Check cache first
      const cached = this.getCachedWeather();
      if (cached) return cached;

      // Try to get real weather data if API key is configured
      if (this.API_KEY_PLACEHOLDER !== 'YOUR_OPENWEATHERMAP_API_KEY') {
        try {
          const realWeatherData = await this.fetchRealWeatherData(lat, lon, city, country, units);
          if (realWeatherData) {
            this.cacheWeather(realWeatherData);
            return realWeatherData;
          }
        } catch (error) {
          console.warn('Failed to fetch real weather data, falling back to mock data:', error);
        }
      }

      // Fallback to mock weather data
      const mockWeather: WeatherData = {
        temperature: units === 'imperial' 
          ? Math.floor(Math.random() * 30) + 60  // 60-90°F
          : Math.floor(Math.random() * 20) + 15, // 15-35°C
        condition: ['sunny', 'cloudy', 'rainy', 'partly_cloudy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        description: 'Perfect weather for indoor wellness activities',
        temperatureUnit: units === 'imperial' ? '°F' : '°C',
        location: city || 'Your Location'
      };

      this.cacheWeather(mockWeather);
      return mockWeather;
    } catch (error) {
      console.error('Error fetching weather:', error);
      return null;
    }
  }

  private static async fetchRealWeatherData(
    lat?: number,
    lon?: number,
    city?: string,
    country?: string,
    units: 'metric' | 'imperial' = 'metric'
  ): Promise<WeatherData | null> {
    let url = 'https://api.openweathermap.org/data/2.5/weather?';
    
    if (lat && lon) {
      url += `lat=${lat}&lon=${lon}`;
    } else if (city) {
      url += `q=${encodeURIComponent(city)}`;
      if (country) {
        url += `,${country}`;
      }
    } else {
      throw new Error('Either coordinates or city name is required');
    }

    url += `&appid=${this.API_KEY_PLACEHOLDER}&units=${units}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return {
      temperature: Math.round(data.main.temp),
      condition: this.mapWeatherCondition(data.weather[0].main),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      temperatureUnit: units === 'imperial' ? '°F' : '°C',
      location: data.name
    };
  }

  private static mapWeatherCondition(condition: string): string {
    const conditionMap: { [key: string]: string } = {
      'Clear': 'sunny',
      'Clouds': 'cloudy',
      'Rain': 'rainy',
      'Drizzle': 'rainy',
      'Thunderstorm': 'rainy',
      'Snow': 'cloudy',
      'Mist': 'partly_cloudy',
      'Fog': 'partly_cloudy'
    };
    return conditionMap[condition] || 'partly_cloudy';
  }

  private static getCachedWeather(): WeatherData | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > this.CACHE_DURATION) {
        localStorage.removeItem(this.CACHE_KEY);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }

  private static cacheWeather(data: WeatherData): void {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error caching weather:', error);
    }
  }

  static convertTemperature(temp: number, from: 'metric' | 'imperial', to: 'metric' | 'imperial'): number {
    if (from === to) return temp;
    
    if (from === 'metric' && to === 'imperial') {
      return Math.round((temp * 9/5) + 32);
    } else if (from === 'imperial' && to === 'metric') {
      return Math.round((temp - 32) * 5/9);
    }
    
    return temp;
  }
}
