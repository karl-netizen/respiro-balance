import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { usePaymentSystem } from '@/hooks/usePaymentSystem';

const SubscriptionSuccessPage = () => {
  const navigate = useNavigate();
  const { checkSubscriptionStatus } = usePaymentSystem();

  useEffect(() => {
    // Check subscription status after successful payment
    const verifySubscription = async () => {
      try {
        await checkSubscriptionStatus();
        toast.success('Subscription activated!', {
          description: 'Welcome to Respiro Balance Premium!'
        });
      } catch (error) {
        console.error('Error verifying subscription:', error);
      }
    };

    verifySubscription();
  }, [checkSubscriptionStatus]);

  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900 dark:text-white">
            Welcome to Premium!
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Your subscription has been successfully activated
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Access to all premium meditation sessions
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Advanced progress tracking and analytics
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Ad-free experience and offline access
              </span>
            </div>
          </div>

          <Button 
            onClick={handleContinue}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            Start Your Premium Journey
          </Button>
          
          <p className="text-xs text-gray-500 dark:text-gray-400">
            You can manage your subscription anytime in your account settings
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionSuccessPage;