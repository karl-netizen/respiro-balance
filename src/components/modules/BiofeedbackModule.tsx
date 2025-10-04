import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Activity, TrendingUp } from 'lucide-react';

export default function BiofeedbackModule() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <span>📱</span> Biofeedback Lite
        </CardTitle>
        <CardDescription>Real-time wellness tracking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Connect your Apple Health or Google Fit to track heart rate, HRV, and stress levels during meditation.
        </p>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-muted rounded-lg">
            <Heart className="w-5 h-5 mx-auto mb-1 text-destructive" />
            <p className="text-xs text-muted-foreground">Heart Rate</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <Activity className="w-5 h-5 mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">HRV</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-success" />
            <p className="text-xs text-muted-foreground">Insights</p>
          </div>
        </div>

        <Button className="w-full">Connect Health App</Button>
      </CardContent>
    </Card>
  );
}
