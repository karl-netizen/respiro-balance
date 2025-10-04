import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sun, CheckCircle2, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MorningRitualsModule() {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <span>🌄</span> Morning Rituals
        </CardTitle>
        <CardDescription>Build powerful morning habits</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Create custom morning routines, track daily habits, and start your day with intention.
        </p>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-muted rounded-lg">
            <Sun className="w-5 h-5 mx-auto mb-1 text-warning" />
            <p className="text-xs text-muted-foreground">Routines</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-success" />
            <p className="text-xs text-muted-foreground">Habits</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <Flame className="w-5 h-5 mx-auto mb-1 text-destructive" />
            <p className="text-xs text-muted-foreground">Streaks</p>
          </div>
        </div>

        <Button className="w-full" onClick={() => navigate('/morning-ritual')}>
          View My Rituals
        </Button>
      </CardContent>
    </Card>
  );
}
