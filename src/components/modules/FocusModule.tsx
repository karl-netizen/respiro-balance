import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Target, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FocusModule() {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <span>🎯</span> Focus Mode
        </CardTitle>
        <CardDescription>Pomodoro timer & productivity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Boost your productivity with Pomodoro sessions. Track focus time and improve deep work capacity.
        </p>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-muted rounded-lg">
            <Timer className="w-5 h-5 mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">Timer</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <Target className="w-5 h-5 mx-auto mb-1 text-warning" />
            <p className="text-xs text-muted-foreground">Goals</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <BarChart3 className="w-5 h-5 mx-auto mb-1 text-success" />
            <p className="text-xs text-muted-foreground">Analytics</p>
          </div>
        </div>

        <Button className="w-full" onClick={() => navigate('/focus')}>
          Start Focus Session
        </Button>
      </CardContent>
    </Card>
  );
}
