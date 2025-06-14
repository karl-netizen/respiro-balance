import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Cloud, Sun, CloudRain, Snowflake, Plus, X } from 'lucide-react';

interface WeatherAlternative {
  id: string;
  ritualId: string;
  condition: string;
  alternativeRitual: string;
}

interface WeatherIntegrationProps {
  rituals: any[];
  alternatives: WeatherAlternative[];
  onAlternativeAdd: (alternative: WeatherAlternative) => void;
  onAlternativeRemove: (id: string) => void;
  onAlternativeUpdate: (alternative: WeatherAlternative) => void;
}

const WeatherIntegration: React.FC<WeatherIntegrationProps> = ({
  rituals,
  alternatives,
  onAlternativeAdd,
  onAlternativeRemove,
  onAlternativeUpdate
}) => {
  const [newRitualId, setNewRitualId] = useState('');
  const [newCondition, setNewCondition] = useState('sunny');
  const [newAlternativeRitual, setNewAlternativeRitual] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddAlternative = () => {
    if (!newRitualId || !newCondition || !newAlternativeRitual) {
      alert('Please fill in all fields');
      return;
    }

    const newAlternative: WeatherAlternative = {
      id: `weather_alt_${Date.now()}`,
      ritualId: newRitualId,
      condition: newCondition,
      alternativeRitual: newAlternativeRitual,
    };

    onAlternativeAdd(newAlternative);
    setNewRitualId('');
    setNewCondition('sunny');
    setNewAlternativeRitual('');
    setIsAdding(false);
  };

  const handleRemoveAlternative = (id: string) => {
    onAlternativeRemove(id);
  };

  const handleUpdateAlternative = (id: string, updatedData: Partial<WeatherAlternative>) => {
    const alternativeToUpdate = alternatives.find(alt => alt.id === id);
    if (!alternativeToUpdate) return;

    const updatedAlternative: WeatherAlternative = {
      ...alternativeToUpdate,
      ...updatedData,
    };

    onAlternativeUpdate(updatedAlternative);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-4 w-4" />;
      case 'rainy': return <CloudRain className="h-4 w-4" />;
      case 'snowy': return <Snowflake className="h-4 w-4" />;
      case 'cloudy': return <Cloud className="h-4 w-4" />;
      default: return <Cloud className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Current Weather Alternatives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alternatives.map(alternative => {
              const ritual = rituals.find(r => r.id === alternative.ritualId);
              const alternativeRitual = rituals.find(r => r.id === alternative.alternativeRitual);

              return (
                <Card key={alternative.id}>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      {ritual ? ritual.title : 'Unknown Ritual'}
                    </CardTitle>
                    <Badge variant="secondary">
                      {getWeatherIcon(alternative.condition)} {alternative.condition}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">
                      Alternative: {alternativeRitual ? alternativeRitual.title : 'Unknown'}
                    </p>
                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveAlternative(alternative.id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Weather Alternative</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAdding ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Select
                  onValueChange={(value) => setNewRitualId(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Ritual" />
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
              <div>
                <Select
                  defaultValue={newCondition}
                  onValueChange={(value) => setNewCondition(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunny">Sunny</SelectItem>
                    <SelectItem value="rainy">Rainy</SelectItem>
                    <SelectItem value="snowy">Snowy</SelectItem>
                    <SelectItem value="cloudy">Cloudy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  onValueChange={(value) => setNewAlternativeRitual(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Alternative" />
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
              <Button onClick={handleAddAlternative}>Add Alternative</Button>
            </div>
          ) : (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Weather Alternative
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherIntegration;
