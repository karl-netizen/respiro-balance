import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen welcome modal
    const hasSeenWelcome = localStorage.getItem('welcome_shown');
    
    if (!hasSeenWelcome) {
      // Show modal after short delay
      setTimeout(() => setOpen(true), 500);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('welcome_shown', 'true');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="text-4xl text-center mb-4">🧘</div>
          <DialogTitle className="text-center text-2xl">
            Welcome to Respiro Balance!
          </DialogTitle>
          <DialogDescription className="text-center">
            Your journey to better wellness starts here
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">✓</span>
            </div>
            <div>
              <p className="font-medium">30 Guided Meditations</p>
              <p className="text-sm text-muted-foreground">From 5 to 60 minutes</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">✓</span>
            </div>
            <div>
              <p className="font-medium">Track Your Progress</p>
              <p className="text-sm text-muted-foreground">See measurable improvements</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">✓</span>
            </div>
            <div>
              <p className="font-medium">Biofeedback Insights</p>
              <p className="text-sm text-muted-foreground">Connect with Apple Health</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button className="w-full" onClick={handleClose}>
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
