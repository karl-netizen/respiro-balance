import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Headphones, Volume2, Moon, ChevronRight } from 'lucide-react';

interface FirstSessionGuideProps {
  open: boolean;
  onClose: () => void;
  onStart: () => void;
}

export function FirstSessionGuide({ open, onClose, onStart }: FirstSessionGuideProps) {
  const [step, setStep] = useState(1);

  const tips = [
    {
      icon: <Headphones className="w-8 h-8" />,
      title: 'Use Headphones',
      description: 'For the best experience, use headphones to fully immerse yourself in the guided meditation.'
    },
    {
      icon: <Volume2 className="w-8 h-8" />,
      title: 'Find a Quiet Space',
      description: 'Choose a comfortable, quiet place where you won\'t be disturbed for the next 10 minutes.'
    },
    {
      icon: <Moon className="w-8 h-8" />,
      title: 'Get Comfortable',
      description: 'Sit or lie down in a comfortable position. Close your eyes and take a deep breath.'
    }
  ];

  const currentTip = tips[step - 1];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your First Meditation</DialogTitle>
          <DialogDescription>
            Quick tips for a great experience
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto text-blue-500">
              {currentTip.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{currentTip.title}</h3>
              <p className="text-muted-foreground">{currentTip.description}</p>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {tips.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index + 1 === step ? 'bg-blue-500' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          {step < tips.length ? (
            <Button onClick={() => setStep(step + 1)} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              Next Tip
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={() => { onClose(); onStart(); }} className="w-full bg-green-500 hover:bg-green-600 text-white">
              Start Session
            </Button>
          )}
          <Button variant="ghost" onClick={onClose} className="w-full">
            Skip Tutorial
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
