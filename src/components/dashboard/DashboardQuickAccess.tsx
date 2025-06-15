
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Activity, 
  TrendingUp, 
  Clock, 
  Heart, 
  Target,
  Zap,
  Brain
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardQuickAccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Access</CardTitle>
        <CardDescription>Jump directly into your wellness activities</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="meditate" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="meditate">Meditate</TabsTrigger>
            <TabsTrigger value="breathe">Breathe</TabsTrigger>
            <TabsTrigger value="focus">Focus</TabsTrigger>
            <TabsTrigger value="ritual">Ritual</TabsTrigger>
          </TabsList>
          
          <TabsContent value="meditate" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/meditation?tab=guided')}
              >
                <Brain className="h-6 w-6 mb-2 text-blue-500" />
                <span>Guided Meditation</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/meditation?tab=quick-breaks')}
              >
                <Zap className="h-6 w-6 mb-2 text-green-500" />
                <span>Quick Break</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/meditation?tab=sleep')}
              >
                <Activity className="h-6 w-6 mb-2 text-indigo-500" />
                <span>Sleep Meditation</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="breathe" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/breathing?type=box')}
              >
                <Activity className="h-6 w-6 mb-2 text-blue-500" />
                <span>Box Breathing</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/breathing?type=4-7-8')}
              >
                <Heart className="h-6 w-6 mb-2 text-red-500" />
                <span>4-7-8 Technique</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="focus" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/focus')}
              >
                <Target className="h-6 w-6 mb-2 text-purple-500" />
                <span>Pomodoro Timer</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/focus?mode=analytics')}
              >
                <TrendingUp className="h-6 w-6 mb-2 text-green-500" />
                <span>Focus Analytics</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="ritual" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/morning-ritual')}
              >
                <Calendar className="h-6 w-6 mb-2 text-orange-500" />
                <span>Morning Ritual</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/morning-ritual?mode=create')}
              >
                <Clock className="h-6 w-6 mb-2 text-purple-500" />
                <span>Create New Ritual</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DashboardQuickAccess;
