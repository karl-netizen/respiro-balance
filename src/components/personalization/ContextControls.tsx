import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Smile, Frown, Meh, Zap, Battery, BatteryLow, RefreshCw } from 'lucide-react';
import { RecommendationContext } from '@/services/AIPersonalizationEngine';

interface ContextControlsProps {
  onUpdate: (context: RecommendationContext) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export function ContextControls({ onUpdate, onRefresh, isLoading }: ContextControlsProps) {
  const [mood, setMood] = useState(5);
  const [stress, setStress] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [availableTime, setAvailableTime] = useState(15);

  const getMoodIcon = () => {
    if (mood <= 3) return <Frown className="h-4 w-4" />;
    if (mood <= 7) return <Meh className="h-4 w-4" />;
    return <Smile className="h-4 w-4" />;
  };

  const getEnergyIcon = () => {
    if (energy <= 3) return <BatteryLow className="h-4 w-4" />;
    if (energy <= 7) return <Battery className="h-4 w-4" />;
    return <Zap className="h-4 w-4" />;
  };

  const handleApply = () => {
    const currentHour = new Date().getHours();
    const timeOfDay = currentHour < 12 ? 'morning' : currentHour < 18 ? 'afternoon' : 'evening';

    onUpdate({
      currentMood: mood,
      currentStress: stress,
      energyLevel: energy,
      availableTime,
      timeOfDay
    } as RecommendationContext);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-base">Customize Your Experience</CardTitle>
        <CardDescription className="text-xs">
          Adjust these settings for more personalized recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mood Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm flex items-center gap-2">
              {getMoodIcon()}
              Current Mood
            </Label>
            <Badge variant="secondary" className="text-xs">
              {mood <= 3 ? 'Low' : mood <= 7 ? 'Neutral' : 'High'}
            </Badge>
          </div>
          <Slider
            value={[mood]}
            onValueChange={(val) => setMood(val[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Stress Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Stress Level</Label>
            <Badge 
              variant={stress > 7 ? 'destructive' : stress > 4 ? 'secondary' : 'outline'} 
              className="text-xs"
            >
              {stress <= 3 ? 'Low' : stress <= 7 ? 'Moderate' : 'High'}
            </Badge>
          </div>
          <Slider
            value={[stress]}
            onValueChange={(val) => setStress(val[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Relaxed</span>
            <span>Stressed</span>
          </div>
        </div>

        {/* Energy Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm flex items-center gap-2">
              {getEnergyIcon()}
              Energy Level
            </Label>
            <Badge variant="secondary" className="text-xs">
              {energy <= 3 ? 'Low' : energy <= 7 ? 'Moderate' : 'High'}
            </Badge>
          </div>
          <Slider
            value={[energy]}
            onValueChange={(val) => setEnergy(val[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Tired</span>
            <span>Energized</span>
          </div>
        </div>

        {/* Available Time */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Available Time</Label>
            <Badge variant="outline" className="text-xs">
              {availableTime} minutes
            </Badge>
          </div>
          <Slider
            value={[availableTime]}
            onValueChange={(val) => setAvailableTime(val[0])}
            min={5}
            max={60}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5 min</span>
            <span>60 min</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleApply} 
            className="flex-1"
            disabled={isLoading}
          >
            Apply & Refresh
          </Button>
          <Button 
            onClick={onRefresh} 
            variant="outline"
            size="icon"
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
