
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface HeatmapDay {
  date: string;
  intensity: number; // 0-4 scale
  sessions: number;
  focusScore: number;
}

interface ProductivityHeatmapProps {
  data: HeatmapDay[];
}

export const ProductivityHeatmap: React.FC<ProductivityHeatmapProps> = ({ data }) => {
  const getIntensityColor = (intensity: number) => {
    const colors = [
      'bg-gray-100', // 0 - no activity
      'bg-green-100', // 1 - low
      'bg-green-300', // 2 - medium
      'bg-green-500', // 3 - high
      'bg-green-700'  // 4 - very high
    ];
    return colors[intensity] || colors[0];
  };

  const getTooltipText = (day: HeatmapDay) => {
    if (day.sessions === 0) return `${day.date}: No focus sessions`;
    return `${day.date}: ${day.sessions} sessions, ${day.focusScore} focus score`;
  };

  // Group data by weeks
  const weeks: HeatmapDay[][] = [];
  let currentWeek: HeatmapDay[] = [];
  
  data.forEach((day, index) => {
    currentWeek.push(day);
    if ((index + 1) % 7 === 0 || index === data.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Productivity Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Heatmap Grid */}
          <div className="space-y-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={day.date}
                    className={`w-3 h-3 rounded-sm ${getIntensityColor(day.intensity)} cursor-pointer transition-all hover:scale-110`}
                    title={getTooltipText(day)}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Day Labels */}
          <div className="flex gap-1">
            {dayLabels.map(label => (
              <div key={label} className="w-3 text-xs text-muted-foreground text-center">
                {label[0]}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map(intensity => (
                <div
                  key={intensity}
                  className={`w-3 h-3 rounded-sm ${getIntensityColor(intensity)}`}
                />
              ))}
            </div>
            <span>More</span>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-semibold">
                {data.reduce((sum, day) => sum + day.sessions, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">
                {Math.round(data.reduce((sum, day) => sum + day.focusScore, 0) / data.length)}
              </div>
              <div className="text-xs text-muted-foreground">Avg Focus Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">
                {data.filter(day => day.sessions > 0).length}
              </div>
              <div className="text-xs text-muted-foreground">Active Days</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
