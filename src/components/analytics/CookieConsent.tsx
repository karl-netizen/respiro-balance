import { useState, useEffect } from 'react';
import { analytics } from '@/lib/analytics/analytics';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('analytics_consent');
    if (!consent) {
      // Show banner after short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    analytics.grantConsent();
    setShowBanner(false);
  };

  const handleDecline = () => {
    analytics.denyConsent();
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="p-4 shadow-lg border-primary/20">
        <div className="flex gap-3">
          <Cookie className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
          <div className="space-y-3 flex-1">
            <p className="text-sm">
              We use cookies and analytics to improve your experience and understand how you use our app. 
              Your data is never sold to third parties.
            </p>
            <div className="flex gap-2">
              <Button onClick={handleAccept} size="sm" className="flex-1">
                Accept
              </Button>
              <Button onClick={handleDecline} variant="outline" size="sm" className="flex-1">
                Decline
              </Button>
            </div>
            <a href="/privacy" className="text-xs text-muted-foreground hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
