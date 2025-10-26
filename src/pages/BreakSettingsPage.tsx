



import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BreakReminderPreferences from '@/components/work-life-balance/BreakReminderPreferences';

const BreakSettingsPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center text-muted-foreground"
              onClick={() => navigate('/work-life-balance')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Work-Life Balance
            </Button>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Break Reminder Settings</h1>
          
          <div className="max-w-2xl mx-auto">
            <BreakReminderPreferences />
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default BreakSettingsPage;
