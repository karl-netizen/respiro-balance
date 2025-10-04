import { useState } from 'react';
import { MODULE_REGISTRY } from '@/lib/modules/moduleRegistry';
import { useModuleStore } from '@/store/moduleStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ModuleSwapDialogProps {
  currentModuleId: string;
}

export function ModuleSwapDialog({ currentModuleId }: ModuleSwapDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState('');
  const { swapModule, canSwapModule, activeModules, getDaysUntilNextSwap } = useModuleStore();
  const { toast } = useToast();

  const currentModule = MODULE_REGISTRY[currentModuleId];
  const canSwap = canSwapModule();
  const daysUntilSwap = getDaysUntilNextSwap();

  const availableModules = Object.values(MODULE_REGISTRY).filter(
    module => !module.alwaysActive && !activeModules.includes(module.id)
  );

  const handleSwap = () => {
    if (selectedModule) {
      swapModule(currentModuleId, selectedModule);
      const newModule = MODULE_REGISTRY[selectedModule];
      toast({
        title: 'Module Swapped!',
        description: `${currentModule?.name} replaced with ${newModule?.name}. Next swap available in 7 days.`,
      });
      setOpen(false);
      setSelectedModule('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <RefreshCw className="w-4 h-4 mr-2" />
          Swap Module
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Swap {currentModule?.name}?</DialogTitle>
          <DialogDescription>
            Replace this module with another. Your progress will be saved.
          </DialogDescription>
        </DialogHeader>

        {!canSwap && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You can only swap modules once per month. 
              Next swap available in <strong>{daysUntilSwap} days</strong>.
            </AlertDescription>
          </Alert>
        )}

        {canSwap && availableModules.length === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No other modules available to swap. All modules are already active or locked.
            </AlertDescription>
          </Alert>
        )}

        {canSwap && availableModules.length > 0 && (
          <RadioGroup value={selectedModule} onValueChange={setSelectedModule}>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {availableModules.map(module => (
                <div key={module.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value={module.id} id={module.id} className="mt-1" />
                  <Label htmlFor={module.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{module.icon}</span>
                      <span className="font-semibold text-foreground">{module.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {module.shortDescription}
                    </p>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSwap} 
            disabled={!selectedModule || !canSwap || availableModules.length === 0}
          >
            Confirm Swap
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
