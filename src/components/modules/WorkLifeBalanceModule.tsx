import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scale, Coffee, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WorkLifeBalanceModule() {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <span>⚖️</span> Work-Life Balance
        </CardTitle>
        <CardDescription>Prevent burnout, stay balanced</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Track your work-life balance meter, get smart break reminders, and maintain healthy boundaries.
        </p>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-muted rounded-lg">
            <Scale className="w-5 h-5 mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">Balance</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <Coffee className="w-5 h-5 mx-auto mb-1 text-warning" />
            <p className="text-xs text-muted-foreground">Breaks</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-destructive" />
            <p className="text-xs text-muted-foreground">Burnout</p>
          </div>
        </div>

        <Button className="w-full" onClick={() => navigate('/work-life-balance')}>
          Check My Balance
        </Button>
      </CardContent>
    </Card>
  );
}
