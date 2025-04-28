
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Flame, Heart, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickAccessSectionProps {
  isPremium: boolean;
}

const QuickAccessSection: React.FC<QuickAccessSectionProps> = ({ isPremium }) => {
  const navigate = useNavigate();
  
  const quickLinks = [
    {
      title: 'Quick Break',
      description: '5-minute meditation',
      icon: <Clock className="h-4 w-4" />,
      action: () => navigate('/meditate?tab=quick'),
      premium: false
    },
    {
      title: 'Focus Session',
      description: 'Enhance concentration',
      icon: <Flame className="h-4 w-4" />,
      action: () => navigate('/meditate?tab=deep'),
      premium: false
    },
    {
      title: 'Sleep Well',
      description: 'Prepare for restful sleep',
      icon: <Heart className="h-4 w-4" />,
      action: () => navigate('/meditate?tab=sleep'),
      premium: true
    }
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Quick Access</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {quickLinks.map((link, index) => (
          <Button
            key={index}
            variant="outline"
            className={`w-full justify-start text-left h-auto py-2 ${
              link.premium && !isPremium ? 'relative opacity-80' : ''
            }`}
            onClick={link.premium && !isPremium ? undefined : link.action}
            disabled={link.premium && !isPremium}
          >
            <div className={`p-1.5 rounded-full mr-2 ${
              link.premium && !isPremium 
                ? 'bg-muted'
                : 'bg-primary/20'
            }`}>
              {link.premium && !isPremium ? <Lock className="h-3.5 w-3.5" /> : link.icon}
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium text-sm">{link.title}</span>
              <span className="text-xs text-muted-foreground">{link.description}</span>
            </div>
            {link.premium && !isPremium && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-muted px-1.5 py-0.5 rounded text-xs">
                Premium
              </div>
            )}
          </Button>
        ))}
        
        <Button variant="default" className="w-full mt-2" onClick={() => navigate('/progress')}>
          View Progress Dashboard
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickAccessSection;
