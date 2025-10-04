import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Scale, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function WorkLifeBalanceModule() {
  const [workMinutesToday] = useState(120); // Mock data
  const [breakMinutesToday] = useState(30); // Mock data
  
  const totalMinutes = workMinutesToday + breakMinutesToday;
  const balanceScore = totalMinutes > 0 ? (breakMinutesToday / totalMinutes) * 100 : 0;
  
  // Ideal balance is 15-20% breaks
  const getBalanceStatus = () => {
    if (balanceScore >= 15 && balanceScore <= 25) return 'good';
    if (balanceScore >= 10 && balanceScore < 15) return 'fair';
    return 'poor';
  };

  const status = getBalanceStatus();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <span>⚖️</span> Work-Life Balance
        </CardTitle>
        <CardDescription>
          Maintain healthy boundaries
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Balance Meter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Balance Score</span>
            <Badge 
              variant={
                status === 'good' ? 'default' : 
                status === 'fair' ? 'secondary' : 
                'destructive'
              }
            >
              {status === 'good' && <CheckCircle2 className="w-3 h-3 mr-1" />}
              {status === 'poor' && <AlertTriangle className="w-3 h-3 mr-1" />}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          <Progress 
            value={balanceScore} 
            className="h-3"
          />
          <p className="text-xs text-muted-foreground">
            {Math.round(balanceScore)}% of time spent on breaks
          </p>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Work Time</p>
            <p className="text-2xl font-bold">{workMinutesToday}m</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Break Time</p>
            <p className="text-2xl font-bold">{breakMinutesToday}m</p>
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-sm">
            {status === 'good' && '✨ Great balance! Keep taking regular breaks.'}
            {status === 'fair' && '💡 Consider taking a 10-minute break soon.'}
            {status === 'poor' && '⚠️ You need more breaks. Step away for 15 minutes.'}
          </p>
        </div>

        <Button className="w-full" variant="outline">
          <Scale className="w-4 h-4 mr-2" />
          Take a Break
        </Button>
      </CardContent>
    </Card>
  );
}
