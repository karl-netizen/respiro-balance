
import React, { useState } from 'react';
import { useFocusMode } from '@/context/FocusProvider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export const ActivityLogs: React.FC = () => {
  const { currentSession, timerState } = useFocusMode();
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState('');
  
  const handleAddNote = () => {
    if (note.trim().length === 0) return;
    
    // In a real app, you'd update the note in your context/state management
    console.log('Adding note:', note);
    setNote('');
  };
  
  if (timerState === 'idle' || timerState === 'completed') {
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-md">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left">
        <span className="font-medium">Session Activity</span>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-muted">
            {currentSession?.distractions || 0} distractions
          </Badge>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="p-3 border-t">
        <div className="space-y-3">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Add a note about your focus session</p>
            <Textarea 
              placeholder="What are you working on?"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="h-24"
            />
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={handleAddNote}>
              Save Note
            </Button>
          </div>
          
          {currentSession?.distractions && currentSession.distractions > 0 ? (
            <div className="pt-2">
              <p className="text-sm font-medium">Distractions logged:</p>
              <p className="text-sm text-muted-foreground">
                You've recorded {currentSession.distractions} distractions in this session.
              </p>
            </div>
          ) : null}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
