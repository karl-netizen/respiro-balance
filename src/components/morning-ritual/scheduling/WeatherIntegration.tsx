
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Cloud, Sun, CloudRain, Snow, Wind, Eye, Calendar } from 'lucide-react';
import { MorningRitual } from '@/context/types';

interface WeatherCondition {
  type: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  temperature: number;
  humidity: number;
  visibility: number;
}

interface WeatherAlternative {
  id: string;
  ritualId: string;
  condition: 'rainy' | 'cold' | 'hot' | 'windy' | 'snowy';
  alternativeTitle: string;
  alternativeDuration: number;
  alternativeLocation: 'indoor' | 'covered' | 'different';
  description: string;
}

interface WeatherIntegrationProps {
  rituals: MorningRitual[];
  alternatives: WeatherAlternative[];
  onAlternativeAdd: (alternative: WeatherAlternative) => void;
  onAlternativeRemove: (alternativeId: string) => void;
  onAlternativeUpdate: (alternative: WeatherAlternative) => void;
}

const WeatherIntegration: React.FC<WeatherIntegrationProps> = ({
  rituals,
  alternatives,
  onAlternativeAdd,
  onAlternativeRemove,
  onAlternativeUpdate
}) => {
  const [currentWeather, setCurrentWeather] = useState<WeatherCondition | null>(null);
  const [selectedRitual, setSelectedRitual] = useState<string>('');
  const [newAlternative, setNewAlternative] = useState({
    condition: 'rainy' as const,
    alternativeTitle: '',
    alternativeDuration: 15,
    alternativeLocation: 'indoor' as const,
    description: ''
  });
  const [autoAdjustments, setAutoAdjustments] = useState(true);

  // Simulate weather data fetching
  useEffect(() => {
    const fetchWeather = () => {
      // Simulated weather data
      const conditions: WeatherCondition['type'][] = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      
      setCurrentWeather({
        type: randomCondition,
        temperature: Math.floor(Math.random() * 30) + 10, // 10-40°C
        humidity: Math.floor(Math.random() * 60) + 40, // 40-100%
        visibility: Math.floor(Math.random() * 10) + 1 // 1-10km
      });
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // Update every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (type: WeatherCondition['type']) => {
    switch (type) {
      case 'sunny': return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-6 w-6 text-blue-500" />;
      case 'snowy': return <Snow className="h-6 w-6 text-blue-300" />;
      case 'windy': return <Wind className="h-6 w-6 text-gray-600" />;
    }
  };

  const getWeatherRecommendations = (weather: WeatherCondition) => {
    const recommendations: string[] = [];
    
    if (weather.type === 'rainy') {
      recommendations.push('Consider indoor alternatives for outdoor activities');
      recommendations.push('Perfect weather for cozy morning routines');
    } else if (weather.type === 'sunny') {
      recommendations.push('Great day for outdoor meditation or exercise');
      recommendations.push('Consider extending outdoor activities');
    } else if (weather.temperature < 5) {
      recommendations.push('Cold weather - consider shorter outdoor durations');
      recommendations.push('Warm up indoors before outdoor activities');
    } else if (weather.temperature > 25) {
      recommendations.push('Warm weather - stay hydrated during activities');
      recommendations.push('Early morning is ideal to avoid heat');
    }
    
    if (weather.humidity > 80) {
      recommendations.push('High humidity - lighter clothing recommended');
    }
    
    if (weather.visibility < 3) {
      recommendations.push('Poor visibility - be careful with outdoor activities');
    }
    
    return recommendations;
  };

  const getAffectedRituals = (weather: WeatherCondition) => {
    return rituals.filter(ritual => {
      // Check if ritual might be affected by weather
      const outdoorKeywords = ['walk', 'run', 'garden', 'outdoor', 'fresh air', 'nature'];
      const isOutdoor = outdoorKeywords.some(keyword => 
        ritual.title.toLowerCase().includes(keyword) || 
        ritual.description?.toLowerCase().includes(keyword)
      );
      
      if (!isOutdoor) return false;
      
      // Check weather conditions that might affect the ritual
      if (weather.type === 'rainy' || weather.type === 'snowy') return true;
      if (weather.temperature < 0 || weather.temperature > 30) return true;
      if (weather.visibility < 3) return true;
      
      return false;
    });
  };

  const handleAddAlternative = () => {
    if (!selectedRitual || !newAlternative.alternativeTitle) return;
    
    const alternative: WeatherAlternative = {
      id: `alt_${Date.now()}`,
      ritualId: selectedRitual,
      ...newAlternative
    };
    
    onAlternativeAdd(alternative);
    
    // Reset form
    setSelectedRitual('');
    setNewAlternative({
      condition: 'rainy',
      alternativeTitle: '',
      alternativeDuration: 15,
      alternativeLocation: 'indoor',
      description: ''
    });
  };

  const getRitualAlternatives = (ritualId: string) => {
    return alternatives.filter(alt => alt.ritualId === ritualId);
  };

  return (
    <div className="space-y-6">
      {/* Current Weather Card */}
      {currentWeather && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getWeatherIcon(currentWeather.type)}
              Current Weather
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{currentWeather.temperature}°C</div>
                <div className="text-sm text-muted-foreground">Temperature</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{currentWeather.humidity}%</div>
                <div className="text-sm text-muted-foreground">Humidity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold flex items-center justify-center gap-1">
                  <Eye className="h-4 w-4" />
                  {currentWeather.visibility}km
                </div>
                <div className="text-sm text-muted-foreground">Visibility</div>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="capitalize">
                  {currentWeather.type}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Today's Recommendations:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {getWeatherRecommendations(currentWeather).map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Affected Rituals Alert */}
      {currentWeather && getAffectedRituals(currentWeather).length > 0 && (
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            <strong>Weather Impact Alert:</strong> {getAffectedRituals(currentWeather).length} of your rituals might be affected by today's weather conditions.
            <div className="mt-2 flex flex-wrap gap-2">
              {getAffectedRituals(currentWeather).map(ritual => (
                <Badge key={ritual.id} variant="secondary">
                  {ritual.title}
                </Badge>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Auto-adjustments Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>Weather Adaptations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Auto-adjust for weather</h4>
              <p className="text-sm text-muted-foreground">
                Automatically suggest alternatives when weather conditions aren't ideal
              </p>
            </div>
            <Switch
              checked={autoAdjustments}
              onCheckedChange={setAutoAdjustments}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Weather Alternative */}
      <Card>
        <CardHeader>
          <CardTitle>Create Weather Alternatives</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ritual</label>
              <Select value={selectedRitual} onValueChange={setSelectedRitual}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ritual..." />
                </SelectTrigger>
                <SelectContent>
                  {rituals.map(ritual => (
                    <SelectItem key={ritual.id} value={ritual.id}>
                      {ritual.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Weather Condition</label>
              <Select 
                value={newAlternative.condition} 
                onValueChange={(value: any) => setNewAlternative(prev => ({ ...prev, condition: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rainy">Rainy Weather</SelectItem>
                  <SelectItem value="cold">Cold Weather (&lt;5°C)</SelectItem>
                  <SelectItem value="hot">Hot Weather (&gt;25°C)</SelectItem>
                  <SelectItem value="windy">Windy Weather</SelectItem>
                  <SelectItem value="snowy">Snowy Weather</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Alternative Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={newAlternative.alternativeTitle}
                onChange={(e) => setNewAlternative(prev => ({ ...prev, alternativeTitle: e.target.value }))}
                placeholder="Indoor alternative..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Alternative Location</label>
              <Select 
                value={newAlternative.alternativeLocation} 
                onValueChange={(value: any) => setNewAlternative(prev => ({ ...prev, alternativeLocation: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indoor">Indoor</SelectItem>
                  <SelectItem value="covered">Covered Area</SelectItem>
                  <SelectItem value="different">Different Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              value={newAlternative.description}
              onChange={(e) => setNewAlternative(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the alternative ritual..."
            />
          </div>
          
          <Button 
            onClick={handleAddAlternative}
            disabled={!selectedRitual || !newAlternative.alternativeTitle}
            className="w-full"
          >
            Add Weather Alternative
          </Button>
        </CardContent>
      </Card>

      {/* Current Alternatives */}
      {alternatives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Weather Alternatives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rituals.map(ritual => {
                const ritualAlts = getRitualAlternatives(ritual.id);
                if (ritualAlts.length === 0) return null;
                
                return (
                  <div key={ritual.id} className="space-y-2">
                    <h4 className="font-medium">{ritual.title}</h4>
                    <div className="space-y-2 ml-4">
                      {ritualAlts.map(alt => (
                        <div key={alt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{alt.alternativeTitle}</div>
                            <div className="text-sm text-muted-foreground">
                              {alt.condition} weather • {alt.alternativeLocation}
                            </div>
                            {alt.description && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {alt.description}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onAlternativeRemove(alt.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeatherIntegration;
