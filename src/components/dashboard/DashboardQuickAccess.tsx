
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TouchFriendlyButton } from '@/components/responsive/TouchFriendlyButton';
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
              <TouchFriendlyButton 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/meditation?tab=guided')}
                hapticFeedback={true}
              >
                <Brain className="h-6 w-6 mb-2 text-blue-500" />
                <span>Guided Meditation</span>
              </TouchFriendlyButton>
              <TouchFriendlyButton 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/meditation?tab=quick')}
                hapticFeedback={true}
              >
                <Zap className="h-6 w-6 mb-2 text-green-500" />
                <span>Quick Break</span>
              </TouchFriendlyButton>
              <TouchFriendlyButton 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/meditation?tab=sleep')}
                hapticFeedback={true}
              >
                <Activity className="h-6 w-6 mb-2 text-indigo-500" />
                <span>Sleep Meditation</span>
              </TouchFriendlyButton>
            </div>
          </TabsContent>
          
          <TabsContent value="breathe" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TouchFriendlyButton 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/breathe?tab=exercises&technique=box')}
                hapticFeedback={true}
              >
                <Activity className="h-6 w-6 mb-2 text-blue-500" />
                <span>Box Breathing</span>
              </TouchFriendlyButton>
              <TouchFriendlyButton 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/breathe?tab=exercises&technique=478')}
                hapticFeedback={true}
              >
                <Heart className="h-6 w-6 mb-2 text-red-500" />
                <span>4-7-8 Technique</span>
              </TouchFriendlyButton>
            </div>
          </TabsContent>
          
          <TabsContent value="focus" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TouchFriendlyButton 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/focus')}
                hapticFeedback={true}
              >
                <Target className="h-6 w-6 mb-2 text-purple-500" />
                <span>Focus Timer</span>
              </TouchFriendlyButton>
              <TouchFriendlyButton 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/focus?tab=analytics')}
                hapticFeedback={true}
              >
                <TrendingUp className="h-6 w-6 mb-2 text-green-500" />
                <span>Focus Analytics</span>
              </TouchFriendlyButton>
            </div>
          </TabsContent>
          
          <TabsContent value="ritual" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TouchFriendlyButton 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/morning-ritual')}
                hapticFeedback={true}
              >
                <Calendar className="h-6 w-6 mb-2 text-orange-500" />
                <span>Morning Ritual</span>
              </TouchFriendlyButton>
              <TouchFriendlyButton 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/morning-ritual?mode=create')}
                hapticFeedback={true}
              >
                <Clock className="h-6 w-6 mb-2 text-purple-500" />
                <span>Create New Ritual</span>
              </TouchFriendlyButton>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DashboardQuickAccess;
